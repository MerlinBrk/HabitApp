import {db} from "../lib/db";
import {supabase} from "../lib/supabase";
import {v4 as uuidv4} from "uuid";
import {WEEKDAYS} from "../utils/constants";
import {eachDayOfInterval, endOfYear, format, startOfYear} from "date-fns";



export async function getHabitById(habitId: string) {
    try {
        return await db.habits.where({id: habitId}).first();
    } catch (err) {
        console.error("Error Fetching Habit by ID", err);
        return null;
    }
}


export async function getHabits(userId: string) {
    try {
        const habits = await db.habits.where({user_id: userId})
            .filter((habit) => !habit.deleted)
            .toArray();
        return habits;
    } catch (err) {
        console.error("Error Fetching a Habit by User", err);
        return [];
    }
}


export async function getDaysHabitsByUserId(userId: string, date: Date) {
    try {
        const todayWeekday = WEEKDAYS[date.getDay()];
        const habits = await db.habits
            .where("user_id")
            .equals(userId)
            .filter((habit) => !!habit.days?.includes(todayWeekday))
            .filter((habit) => !habit.deleted) 
            .toArray();
        return habits;
    } catch (err) {
        console.error("Error Fetching Habits by Date and User", err);
        return [];
    }
}

export async function getNotDaysHabitsByUserId(userId: string, date: Date) {
    try {
        const todayWeekday = WEEKDAYS[date.getDay()];

        const habits = await db.habits
            .where("user_id")
            .equals(userId)
            .filter((habit) => !habit.days?.includes(todayWeekday))
            .filter((habit) => !habit.deleted) 
            .toArray();
        return habits;
    } catch (err) {
        console.error(
            "Error Fetching False Habit by Date",
            err
        );
        return [];
    }
}

export async function getAllHabitLogs(userId: string) {
    try {
        const habitLogs = await db.habit_logs.where({user_id: userId}).toArray();
        return habitLogs; 
    } catch (err) {
        console.error("Error Fetching HabitLogs by User ", err);
        return [];
    }
}

export async function getHabitLogByHabitId(habitId: string) {
    try {
        const habitLog = await db.habit_logs.where({habit_id: habitId}).toArray();
        return habitLog;
    } catch (err) {
        console.error("Error Fetching HabitLog by Id", err);
        return [];
    }
}

export async function getHabitLogByHabitIdAndDateAndUserId(
    habitId: string,
    date: Date,
    userId: string
) {
    try {
        const day = date.toISOString().split("T")[0] + "T00:00:00+00:00";
        const log = await db.habit_logs
            .where({habit_id: habitId, user_id: userId, date: day})
            .first();
        return log;
    } catch (err) {
        console.error("Error Fetching HabitLog By Id, Date and User", err);
        return 0;
    }
}

export async function getHabitLogsByDateAndUserId(
    userId: string,
    day: Date | string
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
        console.error("Error Fetching HabitLog by User and Day", err);
        return [];
    }
}

export async function getPercentageDoneByHabitId(
    habitId: string,
    
) {
    try {
        const habit = await db.habits.where({id: habitId}).first();
        if (!habit || !habit.days || habit.days.length === 0) return 0;

        const formattedDate = new Date(habit.created_at);
        formattedDate.setHours(0, 0, 0, 0);

        const logs = await db.habit_logs.where({habit_id: habitId}).toArray();
        logs.sort((a, b) => b.date.localeCompare(a.date));

        let done = 0;
        let notDone = 0;
        let currentDate = new Date();

        while (currentDate >= formattedDate) {
            const weekday = WEEKDAYS[currentDate.getDay()];
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
            "Error Fetch Percentage By Id ",
            err
        );
        return 0.0;
    }
}

export async function getPercentageDoneByUserId(userId: string) {
    try {
        const habits = await db.habits.where({user_id: userId}).toArray();
        if (!habits || habits.length === 0) return 0;

        let totalPercentage = 0;
        let count = 0;

        for (const habit of habits) {
            
            if (!habit.days || habit.days.length === 0) continue;

            const createdAt = new Date(habit.created_at);
            createdAt.setHours(0, 0, 0, 0);

            let possible = false;
            let checkDate = new Date(createdAt);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            while (checkDate <= today) {
                const weekday = WEEKDAYS[checkDate.getDay()];
                if (habit.days.includes(weekday)) {
                    possible = true;
                    break;
                }
                checkDate.setDate(checkDate.getDate() + 1);
            }

            if (!possible) continue;

            const percent = await getPercentageDoneByHabitId(habit.id);
            totalPercentage += percent;
            count++;
        }
        return count === 0 ? 0 : Math.round(totalPercentage / count);
    } catch (err) {
        console.error(
            "Error Calculating user Done-Percentage",
            err
        );
        return 0;
    }
}


export async function getStreakByHabitId(habitId: string) {
    try {
        const habit = await db.habits.where({id: habitId}).first();
        if (!habit || !habit.days || habit.days.length === 0) return 0;

        const habitLog = await db.habit_logs.where({habit_id: habitId}).toArray();
        const logs = habitLog.filter((log) => log.is_done === true);

        logs.sort((a, b) => b.date.localeCompare(a.date));

        let streak = 0;
        let currentDate = new Date();
        let checkedToday = false;

        while (true) {
            const weekday = WEEKDAYS[currentDate.getDay()];
            if (habit.days.includes(weekday)) {
                const dayStr = currentDate.toISOString().split("T")[0] + "T00:00:00+00:00";
                const found = logs.find((log) => log.date === dayStr);

                if (found) {
                    streak++;
                } else {
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
        console.error("Error Fetching Streak by Habit", err);
        return 0;
    }
}

export async function getUserStreak(userId: string) {
    try {
        const habits = await db.habits.where({user_id: userId}).toArray();
        if (!habits || habits.length === 0) return 0;

        let minStreak = Infinity;

        for (const habit of habits) {
            if (!habit.days || habit.days.length === 0) {
                minStreak = 0;
                break;
            }
            const streak = await getStreakByHabitId(habit.id);
            if (streak < minStreak) minStreak = streak;
            if (minStreak === 0) break;
        }

        return minStreak === Infinity ? 0 : minStreak;
    } catch (err) {
        console.error("Error Fetching User Streak", err);
        return 0;
    }
}

export async function addHabitToDB(
    title: string,
    description: string,
    userId: string,
    isPublic: boolean,
    days: string[]
) {
    try {
        const newHabit = {
            id: crypto.randomUUID(),
            user_id: userId,
            title,
            description: description,
            created_at: new Date().toISOString(),
            is_public: isPublic,
            synced: false,
            deleted: false,
            days,
            longest_streak: 0,
        };
        await db.habits.add(newHabit);
    } catch (err) {
        console.error("Error Adding a new Habit to Dexie", err);
    }
}

export async function addHabitLog(
    userId: string,
    habitId: string,
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
        console.error("Error Adding New HabitLog to Dexie", err);
    }
}

export async function deleteHabit(habitId: string, userId: string) {
    if (navigator.onLine) {
        try {
            await db.habits.delete(habitId);

            const {error} = await supabase
                .from("Habits")
                .delete()
                .eq("id", habitId)
                .eq("user_id", userId);

            if (error) {
                throw error;
            }
            await deleteHabitLog(habitId, userId);
        } catch (err) {
            console.error("Error Deleting Habit:", err);
        }
    } else {
        try {
            const updatedCount = await db.habits.update(habitId, {
                synced: false,
                deleted: true, 
            });
            if (updatedCount === 0) {
                throw new Error("Habit not found");
            }
            
        } catch (err) {
            console.error("Error Marking Habit as Deleted in Dexie", err);
        }
    }
}

export async function deleteHabitLog(habitId: string, userId: string) {
    try {
        const habitLog = await db.habit_logs.where({habit_id: habitId}).toArray();
        if (!habitLog) {

            return;
        }

        for (const log of habitLog) {
            await db.habit_logs.delete(log.id);
            const {error} = await supabase
                .from("Habit_logs")
                .delete()
                .eq("id", log.id)
                .eq("user_id", userId);

            if (error) {
                throw error;
            } 
        }
    } catch (err) {
        console.error("Error Deleting HabitLog by HabitId", err);
        return;
    }
}

export async function updateHabitLogIsDoneById(
    habitLogId: string,
    isDone: boolean
) {
    try {
        await db.habit_logs.update(habitLogId, {
            synced: false,
            is_done: isDone,
        });

        const habitLog = await db.habit_logs.where({id: habitLogId}).first();
        if (!habitLog) return;

        if (isDone) {
            // Check if marking as done increases the streak
            await updateStreakOnLogCreate(habitLog.habit_id);
        } else {
            // Recalculate in case undoing breaks a streak
            await recalculateLongestStreak(habitLog.habit_id);
        }
    } catch (err) {
        console.error("Error Updating HabitLog IsDone", err);
    }
}

/**
 * Calculates the longest streak for a specific habit.
 * @param habitId - The ID of the habit to check.
 * @return The longest streak for the habit.
 */
export async function getLongestStreakByHabitId(habitId: string) {
    try {
        const habit = await db.habits.where({id: habitId}).first();
        if (!habit || !habit.days || habit.days.length === 0) return 0;

        const habitLog = await db.habit_logs.where({habit_id: habitId}).toArray();
        const logs = habitLog
            .filter((log) => log.is_done)
            .map((log) => log.date)
            .sort();

        if (logs.length === 0) return 0;

        let longestStreak = 0;
        let currentStreak = 1;

        for (let i = 1; i < logs.length; i++) {
            const prevDate = new Date(logs[i - 1]);
            const currDate = new Date(logs[i]);

            // Move prevDate forward until currDate is reached, checking only habit.days
            let streakContinues = false;
            let checkDate = new Date(prevDate);
            checkDate.setDate(checkDate.getDate() + 1);

            while (checkDate <= currDate) {
                const weekday = WEEKDAYS[checkDate.getDay()];
                if (habit.days.includes(weekday)) {
                    streakContinues = checkDate.toISOString().split("T")[0] === currDate.toISOString().split("T")[0];
                    break;
                }
                checkDate.setDate(checkDate.getDate() + 1);
            }

            if (streakContinues) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }

        longestStreak = Math.max(longestStreak, currentStreak);

        return longestStreak;
    } catch (err) {
        console.error("Error Fetching longest Streak by Habit", err);
        return 0;
    }
}

/*
 * Updates the longest streak using the current streak once the habit log is created.
 */
export async function updateStreakOnLogCreate(habitId: string) {
    const habit = await db.habits.where({id: habitId}).first();
    if (!habit) return;

    const currentStreak = await getStreakByHabitId(habitId);

    if (currentStreak > habit.longest_streak) {
        try {
            await db.habits.update(habitId, {
                longest_streak: currentStreak
            });

        } catch (err) {
            console.error("Error updating longest streak.")
        }
    }
}

/*
 * Recalculates the longest streak using getLongestStreakByHabitId().
 * Updates the db with new longest streak.
 *
 */
export async function recalculateLongestStreak(habitId: string) {
    const longestStreak = await getLongestStreakByHabitId(habitId);

    try {
        await db.habits.update(habitId, {
            longest_streak: longestStreak
        });

    } catch (err) {
        console.error("Error updating longest streak.")
    }
}

/**
 * Get a map of dates for a habit showing whether it was completed.
 * @param habitId - The habit to check.
 * @param year - The year to generate data for.
 * @returns Record<string, boolean> where key = 'YYYY-MM-DD', value = true (completed) or false.
 */
export async function getHabitCompletionMap(habitId: string, year: number): Promise<Record<string, boolean>> {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));

    // Fetch all logs for that habit within the year
    const logs = await db.habit_logs
        .where("habit_id")
        .equals(habitId)
        .and((log) => {
            const logDate = new Date(log.date);
            return logDate >= start && logDate <= end;
        })
        .toArray();

    // Build date map initialized with false
    const days = eachDayOfInterval({start, end});
    const completionMap: Record<string, boolean> = {};

    days.forEach(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        completionMap[dateStr] = false;
    });

    // Set true for dates where is_done is true
    logs.forEach(log => {
        if (log.is_done) {
            completionMap[log.date] = true;
        }
    });

    return completionMap;
}

/**
 * Get the completion count for a specific habit in a given year.
 * @param habitId - The ID of the habit to check.
 * @param year - The year to filter logs by.
 * @returns Number of completed logs for that habit in the specified year.
 */
export async function getHabitLogCountForYear(habitId: string, year: number): Promise<number> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const logs = await db.habit_logs.where("habit_id").equals(habitId).and(log => log.is_done && log.date >= startDate && log.date <= endDate).toArray();

    return logs.length;
}

export async function clearHabitDB() {
    try {
        await db.habits.clear();
    } catch (err) {
        console.error("Error Clearing Habits in Dexie", err);
    }
}

export async function clearHabitLogsDB() {
    try {
        await db.habit_logs.clear();
    } catch (err) {
        console.error("Error Clearing HabitLogs in Dexie", err);
    }
}

export async function editHabitInDB(habitId: string, title?: string, description?: string, days?: string[], isPublic?: boolean) {
    try {
        await db.habits.update(habitId, {title: title, description: description, days: days, is_public: isPublic});
    }
    catch (err) {
        console.error("Error updating Habit", err);
    }
}