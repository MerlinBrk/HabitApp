// lib/sync.ts
import { supabase } from "./supabase";
import { db } from "./db";
import { deleteHabitLog } from "../services/dexieServices";
import { getUserIdFromSession } from "./auth";

export async function syncUserIdToLocalStorage() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return;

  const userId = data.user.id;
  const userEmail = data.user.email;

  const { data: profile, error: profileError } = await supabase
    .from("Profiles")
    .select("username")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error loading profile:", profileError.message);
    return null;
  }

  if (!profile) {
    return null;
  }

  localStorage.setItem("user_id", userId);
  localStorage.setItem("user_name", profile.username);
  localStorage.setItem("user_email", userEmail ?? "");
}

export async function syncAll() {
  const userId = await getUserIdFromSession();
  if (!userId) return;

  await syncHabitsWithSupabase(userId); 
  await syncHabitLogsWithSupabase(userId);
}

// Sync habits from IndexedDB → Supabase / only unsynced habits
export async function syncHabitsWithSupabase(userId: string) {
  try {
    const allHabits = await db.habits.where("user_id").equals(userId).toArray();
    const unsyncedHabits = allHabits.filter((h) => h.synced === false);

    for (const habit of unsyncedHabits) {
      const { synced, deleted, ...habitWithoutSynced } = habit;
      if (deleted) {
        const { error } = await supabase
          .from("Habits")
          .delete()
          .eq("id", habit.id);

        if (!error) {
          await db.habits.delete(habit.id);
          await deleteHabitLog(habit.id, userId); 
        }
      } else {
        const { error } = await supabase
          .from("Habits")
          .insert([habitWithoutSynced]);

        if (!error) {
          await db.habits.update(habit.id, { synced: true });
        } else {
          console.error("Error syncing habit:", error);
        }
      }
    }
  } catch (err) {
    console.error("Error syncing with Supabase:", err);
  }
}

// Sync habit logs from IndexedDB → Supabase / only unsynced logs
export async function syncHabitLogsWithSupabase(userId: string) {
  try {
    const unsyncedHabitLogs = await db.habit_logs
      .filter((log) => log.user_id === userId && log.synced === false)
      .toArray();

    for (const habitLog of unsyncedHabitLogs) {
      const { synced, ...habitLogWithoutSynced } = habitLog;

      const { error } = await supabase
        .from("Habit_logs")
        .upsert([habitLogWithoutSynced], { onConflict: "id" });

      if (!error) {
        await db.habit_logs.update(habitLog.id, { synced: true });
      } else {
        console.error("Error syncing habit log:", error, habitLogWithoutSynced);
      }
    }
  } catch (err) {
    console.error("Error syncing with Supabase:", err);
  }
}

// Pull habits from Supabase → IndexedDB / all items
export async function pullHabitsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("Habits")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error loading habits from Supabase:", error);
    return;
  }

  if (!data) return;

  for (const habit of data) {
    await db.habits.put({
      ...habit,
      synced: true,
      deleted: false, // Mark locally as synced
    });
  }
}

// Pull habit logs from Supabase → IndexedDB / all items
export async function pullHabitLogsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("Habit_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error loading logs from Supabase:", error);
    return;
  }

  if (!data) return;

  for (const log of data) {
    await db.habit_logs.put({
      ...log,
      synced: true,
    });
  }
}
