// components/Calendar.tsx
import React,{ useEffect } from "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaTimes } from "react-icons/fa";
import {
  getHabitById,
  getTrueHabitLogByHabitId,
} from "../services/dexieServices";
import { type HabitLog, type Habit } from "../lib/db";


interface CalendarProps {
  isActive: boolean;
  selected: Date | undefined;
  habitId: string;
  onSelect: (date: Date | undefined) => void;
  onClose: () => void;
}

export default function Calendar({
  isActive,
  selected,
  habitId,
  onSelect,
  onClose,
}: CalendarProps) {
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [habit, setHabit] = useState<Habit>(); // Typ anpassen, wenn Habit-Objekt bekannt ist

  const loadHabit = async (habitId: string) => {
    const currentHabit = await getHabitById(habitId);
    setHabit(currentHabit); 
  };

  const loadHabitLogs = async (habitId: string) => {
    const currentHabitLogs = await getTrueHabitLogByHabitId(habitId.toString());
    if (currentHabitLogs) {
      setHabitLogs(currentHabitLogs);
    }
  };

  useEffect(() => {
    if (habitId) {
      loadHabitLogs(habitId);
      loadHabit(habitId);
    }
  }, [isActive, habitId]);

  if (!isActive) return null;
  return (
    <div className="relative p-4 bg-white rounded-xl shadow">
      <h1>{habit?.title.toString()}</h1>
      {/* Schließen-Kreuz */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
        aria-label="Kalender schließen"
      >
        <FaTimes size={12} />
      </button>

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        modifiers={{
          completed: habitLogs.map((log) => new Date(log.date)),
        }}
        modifiersClassNames={{
          completed: "rdp-day_completed",
        }}
        weekStartsOn={1}
      />
      <style>
        {`
        .rdp-day_completed {
        background:rgb(119, 10, 228) !important;
        color: white !important;
        border-radius: 9999px !important;
        }
      `}
      </style>
    </div>
  );
}
