import { db } from '../lib/db';
import { supabase } from '../lib/supabase';


export async function deleteHabit(habitId: string, userId: string) {
  try {
    // Lösche das Habit lokal aus IndexedDB
    await db.habits.delete(habitId);

    // Lösche das Habit aus Supabase
    const { error } = await supabase
      .from('Habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId);

    if (error) {
      console.error("❌ Fehler beim Löschen des Habits aus Supabase:", error);
    } else {
      console.log(`✅ Habit mit ID ${habitId} erfolgreich aus Supabase gelöscht.`);
    }

    await deleteHabitLog(habitId, userId); // Lösche auch alle zugehörigen HabitLogs
  } catch (err) {
    console.error("❌ Fehler beim Löschen des Habits:", err);
  }
}

export async function deleteHabitLog(habitId: number, userId: string) {
    try {
        const habitLog = await db.habit_logs.where({ habit_id: habitId, user_id: userId }).first();
        if (!habitLog) {
            console.error(`HabitLog mit ID ${habitId} nicht gefunden.`);
            return;
        }   

        // Lösche den HabitLog lokal aus IndexedDB
        await db.habit_logs.delete(habitLog.id);
    
        // Lösche den HabitLog aus Supabase
        const { error } = await supabase
        .from('Habit_logs')
        .delete()
        .eq('id', habitLog.id)
        .eq('user_id', userId);
    
        if (error) {
        console.error("❌ Fehler beim Löschen des HabitLogs aus Supabase:", error);
        } else {
        console.log(`✅ HabitLog mit ID ${habitId} erfolgreich aus Supabase gelöscht.`);
        }
    } catch (err) {
        console.error("❌ Fehler beim Löschen des HabitLogs:", err);
    }
}