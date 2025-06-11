// lib/sync.ts
import { supabase } from "./supabase";
import { db } from "./db";
import { useUserId } from "../services/useUserId";


export async function syncAll() {
  const userId = useUserId();
  if (!userId) return;

  await syncHabitsWithSupabase(userId);         // Dexie → Supabase
  await syncHabitLogsWithSupabase(userId);
  await pullHabitsFromSupabase(userId);   // Supabase → Dexie
  await pullHabitLogsFromSupabase(userId);
}



//Sync Habits from Indexed DB -> SupaBase / only unsynced Habits
export async function syncHabitsWithSupabase(userId: string) {
  try {
    const allHabits = await db.habits.where("user_id").equals(userId).toArray();
    const unsyncedHabits = allHabits.filter((h) => h.synced === false);

    /*const unsyncedHabits = await db.habits
      .where({ user_id: userId, synced: false })
      .toArray();*/

    for (const habit of unsyncedHabits) {
      const { synced, ...habitWithoutSynced } = habit;

      const { error } = await supabase
        .from("Habits")
        .insert([habitWithoutSynced]);

      if (!error) {
        await db.habits.update(habit.id, { synced: true });
      } else {
        console.error("Fehler beim Sync eines Habits:", error);
      }
    }
  } catch (err) {
    console.error("Fehler beim Sync mit Supabase:", err);
  }
}

//Sync HabitLogs from Indexed DB -> SupaBase / only unsynced HabitsLogs
export async function syncHabitLogsWithSupabase(userId: string) {
  try {
    /*const unsyncedHabitLogs = await db.habit_logs
      .where({ user_id: userId, synced: false })
      .toArray();
*/
    const unsyncedHabitLogs = await db.habit_logs
      .where('[user_id+synced]')
      .equals([userId, false]) // Filtere nach user_id und synced = false
      .toArray();



    for (const habitLog of unsyncedHabitLogs) {
      const { synced, ...habitLogWithoutSynced } = habitLog;
     
      const { error } = await supabase
        .from("Habit_logs")
        .upsert([habitLogWithoutSynced], { onConflict: "id" }); 
      if (!error) {
        await db.habit_logs.update(habitLog.id, { synced: true }); 
      } else {
        console.error("Fehler beim Sync eines HabitLogs:", error, habitLogWithoutSynced);
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
      synced: true, // Markiere sie lokal als synchronisiert
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
