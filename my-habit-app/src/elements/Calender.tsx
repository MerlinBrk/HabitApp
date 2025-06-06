// components/Calendar.tsx
import React, { useEffect } from 'react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FaTimes } from 'react-icons/fa';
import { getHabitLogByHabitId } from "../services/dexieServices";
import { type HabitLog } from '../lib/db';

export default function Calendar({ isActive,selected, habitId, onSelect,onClose }: {
    isActive: boolean;
  selected: Date | undefined;
  habitId: String;
  onSelect: (date: Date | undefined) => void;
  onClose: () => void;
}) {

    const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);

    const loadHabitLogs = async (habitId: string) => {
    const currentHabitLogs = await getHabitLogByHabitId(habitId);
    console.log("Aktuelle Habit Logs:", currentHabitLogs);
    if (currentHabitLogs) {
        setHabitLogs(currentHabitLogs);
      console.log(habitLogs);

    } else {
      console.log("Keine Habit Logs gefunden für Habit ID:", habitId);
    }
  };
  
    useEffect(() => {
    if (habitId) {
      loadHabitLogs(habitId);
    }
  }, [habitId]);


    if (!isActive) return null;
  return (
    <div className="relative p-4 bg-white rounded-xl shadow">
    <h1>{habitLogs.length}</h1>
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
      />
    </div>
  );
}
