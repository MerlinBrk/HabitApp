// lib/db.ts
import Dexie from "dexie";

export interface Habit {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  is_public: boolean;
  synced: boolean;
  deleted: boolean;
  days?: string[];
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
  habit_logs!: Dexie.Table<HabitLog, number>;

  constructor() {
    super("HabitTrackerDB");
    this.version(1).stores({
      habits: "id,user_id,created_at,synced,deleted",  // Sicherstellen, dass "synced" auch indexiert ist
      habit_logs: "id,[user_id+synced],[habit_id+user_id+date],user_id,habit_id,date,synced",  // Compound index for user_id+synced
    });
  }
}

export const db = new MyDatabase();
