import { db } from '../lib/db';
import { supabase } from '../lib/supabase';



export async function getHabitById(habitId: string, userId: string) {
  try {
    // Suche das Habit lokal in IndexedDB
    const habit = await db.habits.where({ id: habitId, user_id: userId }).first();
    return habit; // Gibt das gefundene Habit zurück (oder undefined, falls nicht gefunden)
  } catch (err) {
    console.error("❌ Fehler beim Abrufen des Habits:", err);
    return null;
  }
}

export async function getHabits(userId: string) {
  try {
    // Suche alle Habits des Benutzers lokal in IndexedDB
    const habits = await db.habits.where({ user_id: userId }).toArray();
    return habits; // Gibt die Liste der Habits zurück
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der Habits:", err);
    return [];
  }
}

export async function getAllHabitLogs(userId: string) {
  try {
    // Suche alle HabitLogs des Benutzers lokal in IndexedDB
    const habitLogs = await db.habit_logs.where({ user_id: userId }).toArray();
    return habitLogs; // Gibt die Liste der HabitLogs zurück
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der HabitLogs:", err);
    return [];
  }
}

export async function getHabitLogByHabitId(habitId: number) {
  try {
    // Suche den HabitLog lokal in IndexedDB
    const habitLog = await db.habit_logs.where({ habit_id: habitId}).toArray();
    return habitLog; // Gibt den gefundenen HabitLog zurück (oder undefined, falls nicht gefunden)
  } catch (err) {
    console.error("❌ Fehler beim Abrufen des HabitLogs:", err);
    return [];
  }
}

export async function getHabitLogByHabitLogId(habitLogId: number, userId: string) {
  try {
    // Suche den HabitLog lokal in IndexedDB
    const habitLog = await db.habit_logs.where({ id: habitLogId, user_id: userId }).first();
    return habitLog; // Gibt den gefundenen HabitLog zurück (oder undefined, falls nicht gefunden)
  } catch (err) {
    console.error("❌ Fehler beim Abrufen des HabitLogs:", err);
    return null;
  }
}

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
        const habitLog = await db.habit_logs.where({ habit_id: habitId}).toArray();
        if (!habitLog) {
            console.error(`HabitLog mit ID ${habitId} nicht gefunden.`);
            return;
        }   
        
        for( const log of habitLog) {
        // Lösche den HabitLog lokal aus IndexedDB
        console.log(`HabitLog mit ID ${log.id} gefunden. Lösche...`);
        await db.habit_logs.delete(log.id);
        }
        console.log(`Habit ID:${habitId} / User ID:${userId} erfolgreich aus IndexedDB gelöscht.`);
        // Lösche alle HabitLogs mit der habit_id und user_id aus Supabase
        const { error } = await supabase
          .from('Habit_logs')
          .delete()
          .eq('habit_id', habitId)
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