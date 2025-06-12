import { db } from "../lib/db";
import { supabase } from "../lib/supabase";

export async function getHabitById(habitId: string) {
  try {
    // Suche das Habit lokal in IndexedDB
    const habit = await db.habits
      .where({ id: habitId})
      .first();
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

export async function getTodaysHabitsByUserId(userId: string) {
  try {
    // Ermittle den heutigen Wochentag als String wie in "days" gespeichert ("Mo", "Di", ...)
    const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const todayWeekday = weekdays[new Date().getDay()];

    const habits = await db.habits
      .where("user_id")
      .equals(userId)
      .filter((habit) => habit.days?.includes(todayWeekday))
      .toArray();
    return habits; // Gibt die Liste der Habits für heute zurück
  } catch (err) {
    console.error("Fehler beim Abrufen der Habits für heute:", err);
    return [];
  }
}

export async function getNotTodayHabitsByUserId(userId: string) {
  try {

    // Ermittle den heutigen Wochentag als String wie in "days" gespeichert ("Mo", "Di", ...)
    const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const todayWeekday = weekdays[new Date().getDay()];

    const habits = await db.habits
      .where("user_id")
      .equals(userId)
      .filter((habit) => !habit.days?.includes(todayWeekday))
      .toArray();
    return habits; // Gibt die Liste der Habits zurück, die nicht für heute sind
  }
 catch (err) {
    console.error("Fehler beim Abrufen der Habits, die nicht für heute sind:", err);
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
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    return habitLog; // Gibt den gefundenen HabitLog zurück (oder undefined, falls nicht gefunden)
  } catch (err) {
    console.error("Fehler beim Abrufen des HabitLogs:", err);
    return [];
  }
}

export async function getTodaysHabitLogsByUserId(userId: string) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logs = await db.habit_logs
      .where("user_id")
      .equals(userId)
      .filter((log) => log.date.startsWith(today))
      .toArray();
    return logs; // Gibt die Liste der HabitLogs für heute zurück
  } catch (err) {
    console.error("Fehler beim Abrufen der HabitLogs für heute:", err);
    return [];
  }
}

export async function getTrueHabitLogByHabitId(habitId: number) {
  try {
    // Suche den HabitLog lokal in IndexedDB
    const habitLog = await db.habit_logs.where({ habit_id: habitId}).toArray();
    const filteredHabitLog = habitLog.filter(log => log.is_done === true);
    return filteredHabitLog;
    return habitLog; // Gibt den gefundenen HabitLog zurück (oder undefined, falls nicht gefunden)
  } catch (err) {
    console.error("Fehler beim Abrufen des HabitLogs:", err);
    return [];
  }
}


export async function getHabitLogByHabitLogId(
  habitLogId: number,
  userId: string
) {
  try {
    // Suche den HabitLog lokal in IndexedDB
    const habitLog = await db.habit_logs
      .where({ id: habitLogId, user_id: userId })
      .first();
    return habitLog; // Gibt den gefundenen HabitLog zurück (oder undefined, falls nicht gefunden)
  } catch (err) {
    console.error("❌ Fehler beim Abrufen des HabitLogs:", err);
    return null;
  }
}

export async function addHabitToDB(
  title: string,
  userId: string,
  isPublic: boolean,
  days: string[]
) {
  try {
    const newHabit = {
      id: crypto.randomUUID(), // Generiere eine eindeutige ID
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      is_public: isPublic,
      synced: false, // Markiere es als unsynchronisiert
      days,
    };  

    await db.habits.add(newHabit); // Füge das Habit lokal in IndexedDB hinzu
  } catch (err) {
    console.error("Fehler beim Hinzufügen des Habits:", err);
  }
}

export async function deleteHabit(habitId: string, userId: string) {
  try {
    // Lösche das Habit lokal aus IndexedDB
    await db.habits.delete(habitId);

    // Lösche das Habit aus Supabase
    const { error } = await supabase
      .from("Habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Fehler beim Löschen des Habits aus Supabase:", error);
    } else {
      console.log(
        `✅ Habit mit ID ${habitId} erfolgreich aus Supabase gelöscht.`
      );
    }

    await deleteHabitLog(habitId, userId); // Lösche auch alle zugehörigen HabitLogs
  } catch (err) {
    console.error("❌ Fehler beim Löschen des Habits:", err);
  }
}

export async function deleteHabitLog(habitId: number, userId: string) {
  try {
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    if (!habitLog) {
      console.error(`HabitLog mit ID ${habitId} nicht gefunden.`);
      return;
    }

    for (const log of habitLog) {   
      // Lösche den HabitLog lokal aus IndexedDB
      await db.habit_logs.delete(log.id);
      const { error } = await supabase
        .from("Habit_logs")
        .delete()
        .eq("id", log.id)
        .eq("user_id", userId);

      if (error) {
        console.error(
          "❌ Fehler beim Löschen des HabitLogs aus Supabase:",
          error
        );
      } else {
        console.log(
          `✅ HabitLog mit ID ${habitId} erfolgreich aus Supabase gelöscht.`
        );
      }
    }


    // Lösche alle HabitLogs mit der habit_id und user_id aus Supabase
  } catch (err) {
    console.error("❌ Fehler beim Löschen des HabitLogs:", err);
  }
}
