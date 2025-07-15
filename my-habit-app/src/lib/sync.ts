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
    console.error("Fehler beim Laden des Profils:", profileError.message);
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

  await syncHabitsWithSupabase(userId); // Dexie → Supabase
  await syncHabitLogsWithSupabase(userId);
  //await pullHabitsFromSupabase(userId);   // Supabase → Dexie
  //await pullHabitLogsFromSupabase(userId);
}

//Sync Habits from Indexed DB -> SupaBase / only unsynced Habits
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
          await deleteHabitLog(habit.id, userId); // Lösche alle zugehörigen HabitLogs
        }
      } else {
        const { error } = await supabase
          .from("Habits")
          .insert([habitWithoutSynced]);

        if (!error) {
          await db.habits.update(habit.id, { synced: true });
        } else {
          console.error("Fehler beim Sync eines Habits:", error);
        }
      }
    }
  } catch (err) {
    console.error("Fehler beim Sync mit Supabase:", err);
  }
}

//Sync HabitLogs from Indexed DB -> SupaBase / only unsynced HabitsLogs
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
        console.error(
          "Fehler beim Sync eines HabitLogs:",
          error,
          habitLogWithoutSynced
        );
      }
    }
  } catch (err) {
    console.error(" Fehler beim Sync mit Supabase:", err);
  }
}

//Pull Habits from SupaBase -> Indexed DB / all Elements
export async function pullHabitsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("Habits")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Fehler beim Laden der Habits von Supabase:", error);
    return;
  }

  if (!data) return;

  for (const habit of data) {
    await db.habits.put({
      ...habit,
      synced: true,
      deleted: false, // Markiere sie lokal als synchronisiert
    });
  }
}

//Pull HabitLogs from SupaBase -> Indexed DB / all Elements
export async function pullHabitLogsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("Habit_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Fehler beim Laden der Logs von Supabase:", error);
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
