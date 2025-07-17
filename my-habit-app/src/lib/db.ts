// lib/db.ts
import Dexie from "dexie";

export interface Habit {
    id: string;
    user_id: string;
    created_at: string;
    title: string;
    description: string;
    is_public: boolean;
    synced: boolean;
    days?: string[];
    longest_streak: number;
    deleted: boolean;
}

export interface HabitLog {
    id: string;
    user_id: string;
    habit_id: string;
    date: string;
    synced: boolean;
    is_done: boolean;
}

class MyDatabase extends Dexie {
    habits!: Dexie.Table<Habit, string>;
    habit_logs!: Dexie.Table<HabitLog, string>;

    constructor() {
        super("HabitTrackerDB");
        this.version(1).stores({
            habits: "id,user_id,created_at,synced,deleted",  
            habit_logs: "id,[user_id+synced],[habit_id+user_id+date],user_id,habit_id,date,synced",  
        });
    }
}

export const db = new MyDatabase();
