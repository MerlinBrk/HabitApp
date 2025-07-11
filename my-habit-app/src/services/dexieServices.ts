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
    const habits = await db.habits.where({ user_id: userId })
    .filter((habit) => !habit.deleted)
    .toArray();
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
      .filter((habit) => !habit.deleted) // Filtere gelöschte Habits aus
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
      .filter((habit) => !habit.deleted) // Filtere gelöschte Habits aus
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



// Gibt alle HabitLogs eines Benutzers zurück, die zu einem bestimmten Habit gehören
export async function getHabitLogByHabitId(habitId: number) {
  try {
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    return habitLog;
  } catch (err) {
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
export async function getHabitLogsByDateAndUserId(userId: string, day: Date) {
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

export async function getPercentageDoneByHabitId(
  habitId: string,
  userId: string
) {
  try {
    // Hole das Habit, um die aktiven Wochentage zu bekommen
    const habit = await db.habits.where({ id: habitId }).first();
    if (!habit || !habit.days || habit.days.length === 0) return 0;

    const formattedDate = new Date(habit.created_at);
    formattedDate.setHours(0, 0, 0, 0);

    const logs = await db.habit_logs.where({ habit_id: habitId }).toArray();
    logs.sort((a, b) => b.date.localeCompare(a.date));

    let done = 0;
    let notDone = 0;
    let currentDate = new Date();

    while (currentDate >= formattedDate) {
      const weekday = WEEKDAYS[currentDate.getDay()];
      // Prüfe, ob das Habit an diesem Wochentag gemacht werden soll
      if (habit.days.includes(weekday)) {
        const dayStr =
          currentDate.toISOString().split("T")[0] + "T00:00:00+00:00";
        const found = logs.find((log) => log.date === dayStr);

        if (found) {
          if (found.is_done) {
            done++;
          } else {
            notDone++;
          }
        } else {
          notDone++;
        }
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return done + notDone === 0
      ? 100
      : Math.round(100 * (done / (done + notDone)));
  } catch (err) {
    console.error(
      "Fehler beim Anfordern der Prozente wie oft das Habit gemacht wurde",
      err
    );
    return 0.0;
  }
}

// Gibt den durchschnittlichen Prozentsatz aller Habits eines Users zurück
export async function getPercentageDoneByUserId(userId: string) {
  try {
    const habits = await db.habits.where({ user_id: userId }).toArray();
    if (!habits || habits.length === 0) return 0;

    let totalPercentage = 0;
    let count = 0;

    for (const habit of habits) {
      // Prüfe, ob das Habit überhaupt schon hätte gemacht werden können
      if (!habit.days || habit.days.length === 0) continue;

      const createdAt = new Date(habit.created_at);
      createdAt.setHours(0, 0, 0, 0);

      let possible = false;
      let checkDate = new Date(createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Prüfe, ob zwischen Erstellungsdatum und heute ein Tag liegt, an dem das Habit aktiv ist
      while (checkDate <= today) {
        const weekday = WEEKDAYS[checkDate.getDay()];
        if (habit.days.includes(weekday)) {
          possible = true;
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      if (!possible) continue;

      const percent = await getPercentageDoneByHabitId(habit.id, userId);
      totalPercentage += percent;
      count++;
    }
    return count === 0 ? 0 : Math.round(totalPercentage / count);
  } catch (err) {
    console.error(
      "Fehler beim Berechnen des durchschnittlichen Prozentsatzes für den User",
      err
    );
    return 0;
  }
}

export async function getStreakByHabitId(habitId: string, userId: string) {
  try {
    // Hole das Habit, um die aktiven Wochentage zu bekommen
    const habit = await db.habits.where({ id: habitId }).first();
    if (!habit || !habit.days || habit.days.length === 0) return 0;

    // Hole alle HabitLogs für dieses Habit, die erledigt wurden, sortiert nach Datum absteigend
    const habitLog = await db.habit_logs.where({ habit_id: habitId }).toArray();
    const logs = habitLog.filter((log) => log.is_done === true);

    // Sortiere die Logs absteigend nach Datum
    logs.sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    let currentDate = new Date();
    let checkedToday = false;

    while (true) {
      const weekday = WEEKDAYS[currentDate.getDay()];
      // Prüfe, ob das Habit an diesem Wochentag gemacht werden soll
      if (habit.days.includes(weekday)) {
        const dayStr =
          currentDate.toISOString().split("T")[0] + "T00:00:00+00:00";
        const found = logs.find((log) => log.date === dayStr);

        if (found) {
          streak++;
        } else {
          // Wenn wir heute prüfen und heute kein Log existiert, ignoriere heute und prüfe weiter mit gestern
          if (!checkedToday) {
            checkedToday = true;
            currentDate.setDate(currentDate.getDate() - 1);
            continue;
          } else {
            break;
          }
        }
      }
      currentDate.setDate(currentDate.getDate() - 1);
      checkedToday = true;
    }

    return streak;
  } catch (err) {
    console.error("Fehler beim Abrufen der Streak", err);
    return 0;
  }
}

// Gibt die niedrigste Streak aller Habits eines Users zurück (User-Streak)
export async function getUserStreak(userId: string) {
  try {
    const habits = await db.habits.where({ user_id: userId }).toArray();
    if (!habits || habits.length === 0) return 0;

    let minStreak = Infinity;

    for (const habit of habits) {
      if (!habit.days || habit.days.length === 0) {
        minStreak = 0;
        break;
      }
      const streak = await getStreakByHabitId(habit.id, userId);
      if (streak < minStreak) minStreak = streak;
      if (minStreak === 0) break;
    }

    return minStreak === Infinity ? 0 : minStreak;
  } catch (err) {
    console.error("Fehler beim Berechnen der User-Streak", err);
    return 0;
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
      deleted: false, // Neues Feld für gelöschte Habits
      days,
    };
    await db.habits.add(newHabit);
  } catch (err) {
    console.error("Fehler beim Hinzufügen des Habits:", err);
  }
}

//Hinzufügen eines neuen HabitLogs für ein besimmtes Habit
export async function addHabitLog(
  userId: string,
  habitId: number,
  date: Date,
  isDone: boolean
) {
  try {
    const day = date.toISOString().split("T")[0] + "T00:00:00+00:00";
    await db.habit_logs.add({
      id: uuidv4(),
      user_id: userId,
      habit_id: habitId,
      date: day,
      synced: false,
      is_done: isDone,
    });
  } catch (err) {
    console.error("Fehler beim Hinzufügen eines Habit Logs", err);
  }
}

//Löschen eines Habits
export async function deleteHabit(habitId: string, userId: string) {
  if (navigator.onLine) {
    try {
      await db.habits.delete(habitId);

      const { error } = await supabase
        .from("Habits")
        .delete()
        .eq("id", habitId)
        .eq("user_id", userId);

      if (error) {
        console.error("Fehler beim Löschen des Habits aus Supabase:", error);
      }
      await deleteHabitLog(habitId, userId);
    } catch (err) {
      console.error("Fehler beim Löschen des Habits:", err);
    }
  } else {
    try {
      const { error } = await db.habits.update(habitId, {
        synced: false,
        deleted: true, // Markiere das Habit als gelöscht
      });
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Fehler beim Markieren des Habits als gelöscht:", err);
    }
  }
}

//Löschen eines Habit Logs aus IndexedDB
export async function deleteHabitLog(habitId: string, userId: string) {
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
        console.error("Fehler beim Löschen des HabitLogs aus Supabase:", error);
      } else {
        
      }
    }
  } catch (err) {
    console.error("Fehler beim Löschen des HabitLogs:", err);
  }
}

//Aktualisieren von IsDone-Wert für ein Habit Log
export async function updateHabitLogIsDoneById(
  habitLogId: string,
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

export async function clearHabitDB() {
  try {
    await db.habits.clear();
  } catch (err) {
    console.error("Fehler beim Clearen der Indexed DB Habits", err);
  }
}

export async function clearHabitLogsDB() {
  try {
    await db.habit_logs.clear();
  } catch (err) {
    console.error("Fehler beim Clearen der Indexed DB HabitLogs", err);
  }
}
