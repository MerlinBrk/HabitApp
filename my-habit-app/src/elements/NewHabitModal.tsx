// components/Calendar.tsx
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { type HabitLog } from '../lib/db';
import { useUserId } from '../services/useUserId';
import { db } from '../lib/db';
import { addHabitToDB } from '../services/dexieServices';

const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function NewHabitModal({ isActive,onClose }: {
    isActive: boolean;
  onClose: () => void;
}) {
const [newHabit, setNewHabit] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(daysOfWeek.slice(0, 7)); // Standardmäßig alle Tage ausgewählt


  const USER_ID = useUserId();

    const addHabit = async () => {
    if (!newHabit.trim()) return;
    
    await addHabitToDB(newHabit, USER_ID, isPublic, selectedDays);
    
    setNewHabit("");
    setIsPublic(false);
    setSelectedDays([]);
    onClose();
  };


    if (!isActive) return null;
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="relative p-6 bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            {/* Schließen-Kreuz */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-3 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
                aria-label="Kalender schließen"
            >
                <FaTimes size={16} />
            </button>
            <div className="mb-6">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Neues Habit"
                    className="w-full bg-black text-white text-base placeholder-gray-400 px-4 py-2 rounded-xl mb-2 focus:outline-none"
                />
                <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        className="w-4 h-4 color-white rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Öffentlich sichtbar
                </label>
                <button
                    onClick={addHabit}
                    className="w-full bg-primary text-white py-2 rounded-xl font-semibold bg-purple-700 hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                    Hinzufügen
                </button>
            </div>
        </div>
    </div>
);
}
