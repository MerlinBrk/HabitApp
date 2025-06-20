import { db } from "../lib/db";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { WEEKDAYS } from "../utils/constants";


//Gibt ein Habit anhand der ID zurück
export async function getHabitById(habitId: string) {
  try {
    const habit = await db.habits.where({ id: habitId }).first();
    return habit; 
  } catch (err) {
    console.error("Fehler beim Abrufen des Habits:", err);
    return null;
  }
}



// Gibt alle Habits eines Benutzers zurück
export async function getHabits(userId: string) {
  try {
    const habits = await db.habits.where({ user_id: userId }).toArray();
    return habits; 
  } catch (err) {
    console.error("Fehler beim Abrufen der Habits:", err);
    return [];
  }
}

//Gibt alle Habits eines Benutzers zurück, die für den gewählten Tag aktiv sind
export async function getDaysHabitsByUserId(userId: string, date: Date) {
  try {
    const todayWeekday = WEEKDAYS[date.getDay()];
    const habits = await db.habits
      .where("user_id")
      .equals(userId)
      .filter((habit) => habit.days?.includes(todayWeekday))
      .toArray();
    return habits; 
  } catch (err) {
    console.error("Fehler beim Abrufen der Habits für heute:", err);
    return [];
  }
}

// Gibt alle Habits eines Benutzers zurück, die nicht für den gewählten Tag aktiv sind
export async function getNotDaysHabitsByUserId(userId: string, date: Date) {
  try {
    const todayWeekday = WEEKDAYS[date.getDay()];

    const habits = await db.habits
      .where("user_id")
      .equals(userId)
      .filter((habit) => !habit.days?.includes(todayWeekday))
      .toArray();
    return habits;
  } catch (err) {
    console.error(
      "Fehler beim Abrufen der Habits, die nicht für heute sind:",
      err
    );
    return [];
  }
}

// Gibt alle HabitLogs eines Benutzers zurück
export async function getAllHabitLogs(userId: string) {
  try {
    const habitLogs = await db.habit_logs.where({ user_id: userId }).toArray();
    return habitLogs; // Gibt die Liste der HabitLogs zurück
  } catch (err) {
    console.error("Fehler beim Abrufen der HabitLogs:", err);
    return [];
  }
}

// Gibt alle HabitLogs eines Benutzers zurück, die zu einem bestimmten Habit gehören
export async function getHabitLogByHabitId(habitId: number) {
  try {
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    return habitLog;   } catch (err) {
    console.error("Fehler beim Abrufen des HabitLogs:", err);
    return [];
  }
}

// Gibt einen HabitLog für einen bestimmten Habit, ein bestimmtes Datum und einen Benutzer zurück
export async function getHabitLogByHabitIdAndDateAndUserId(
  habitId: number,
  date: Date,
  userId: string
) {
  try {
    const day = date.toISOString().split("T")[0] + "T00:00:00+00:00";
    const log = await db.habit_logs
      .where({ habit_id: habitId, user_id: userId, date: day })
      .first();
    return log;
  } catch (err) {
    console.error("Fehler beim Abrufen eines HabitLogs", err);
    return 0;
  }
}

// Gibt alle HabitLogs eines Benutzers für einen bestimmten Tag zurück
export async function getHabitLogsByDateAndUserId(
  userId: string,
  day: Date
) {
  try {
    const formattedDate =
      day instanceof Date ? day.toISOString().split("T")[0] : day.split("T")[0]; // Formatieren des Datums als "YYYY-MM-DD"
    const habitLogs = await db.habit_logs
      .where("user_id")
      .equals(userId)
      .filter((log) => log.date.startsWith(formattedDate))
      .toArray();
    return habitLogs; 
    } catch (err) {
    console.error("Fehler beim Abrufen der HabitLogs:", err);
    return [];
  }
}

// Gibt alle HabitLogs eines Benutzers für einen bestimmten Habit zurück, die als erledigt markiert sind
export async function getTrueHabitLogByHabitId(habitId: number) {
  try {
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    const filteredHabitLog = habitLog.filter((log) => log.is_done === true);
    return filteredHabitLog;
    return habitLog; 
    } catch (err) {
    console.error("Fehler beim Abrufen des HabitLogs:", err);
    return [];
  }
}

//Gibt alle Habits für einen User und die HabitLog ID zurück
export async function getHabitLogByHabitLogId(
  habitLogId: number,
  userId: string
) {
  try {
    const habitLog = await db.habit_logs
      .where({ id: habitLogId, user_id: userId })
      .first();
    return habitLog;
    } catch (err) {
    console.error("❌ Fehler beim Abrufen des HabitLogs:", err);
    return null;
  }
}

//Hinzufügen eines Habits zur IndexedDB
export async function addHabitToDB(
  title: string,
  userId: string,
  isPublic: boolean,
  days: string[]
) {
  try {
    const newHabit = {
      id: crypto.randomUUID(), 
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      is_public: isPublic,
      synced: false, 
      days,
    };
    await db.habits.add(newHabit); 
  } catch (err) {
    console.error("Fehler beim Hinzufügen des Habits:", err);
  }
}

//Hinzufügen eines neuen HabitLogs für ein besimmtes Habit
export async function addHabitLog(userId:string, habitId:number, date: Date, isDone:boolean)
{
  try{
  const day = date.toISOString().split("T")[0] + "T00:00:00+00:00";
  await db.habit_logs.add({
        id: uuidv4(),
        user_id: userId,
        habit_id: habitId,
        date: day,
        synced: false,
        is_done: isDone,
      });
    }
    catch(err){
      console.error("Fehler beim Hinzufügen eines Habit Logs",err)
    }
}

//Löschen eines Habits
export async function deleteHabit(habitId: string, userId: string) {
  try {
    await db.habits.delete(habitId);

    const { error } = await supabase
      .from("Habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", userId);

    if (error) {
      console.error("Fehler beim Löschen des Habits aus Supabase:", error);
    } else {
      console.log(
        `Habit mit ID ${habitId} erfolgreich aus Supabase gelöscht.`
      );
    }
    await deleteHabitLog(habitId, userId); 
  } catch (err) {
    console.error("Fehler beim Löschen des Habits:", err);
  }
}

//Löschen eines Habit Logs aus IndexedDB
export async function deleteHabitLog(habitId: number, userId: string) {
  try {
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    if (!habitLog) {
      console.error(`HabitLog mit ID ${habitId} nicht gefunden.`);
      return;
    }

    for (const log of habitLog) {
      await db.habit_logs.delete(log.id);
      const { error } = await supabase
        .from("Habit_logs")
        .delete()
        .eq("id", log.id)
        .eq("user_id", userId);

      if (error) {
        console.error(
          "Fehler beim Löschen des HabitLogs aus Supabase:",
          error
        );
      } else {
        console.log(
          `HabitLog mit ID ${habitId} erfolgreich aus Supabase gelöscht.`
        );
      }
    }
  } catch (err) {
    console.error("Fehler beim Löschen des HabitLogs:", err);
  }
}

//Aktualisieren von IsDone-Wert für ein Habit Log
export async function updateHabitLogIsDoneById(
  habitLogId: number,
  isDone: boolean
) {
  try {
    await db.habit_logs.update(habitLogId, {
      synced: false,
      is_done: isDone,
    });
  } catch (err) {
    console.error("Fehler beim Updaten eines Habit Logs", err);
  }
}
