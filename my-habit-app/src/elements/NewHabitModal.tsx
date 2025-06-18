// components/Calendar.tsx
import React from "react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useUserId } from "../services/useUserId";
import { addHabitToDB } from "../services/dexieServices";
import { WEEKDAYS } from "../utils/constants";
import {USER_ID} from "../utils/constants";

interface NewHabitModalProps {
  isActive: boolean;
  onClose: () => void;
}

export default function NewHabitModal({
  isActive,
  onClose,
}: NewHabitModalProps) {
  const [newHabit, setNewHabit] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    WEEKDAYS.slice(0, 7)
  ); // Standardmäßig alle Tage ausgewählt


  const addHabit = async () => {
    if (!newHabit.trim()) return;

    await addHabitToDB(newHabit, USER_ID, isPublic, selectedDays);

    setNewHabit("");
    setIsPublic(false);
    setSelectedDays([]);
    onClose();
  };

  const toggleDay = async(day) => {
    
    setSelectedDays((prev) => {
        const newDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
         // Update the database with the new selection
        return newDays;
    });
};

  if (!isActive) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative p-6 bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Schließen-Kreuz */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 flex bg-white items-center justify-center  hover:border-white text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
          aria-label="Kalender schließen"
        >
          <FaTimes size={12} />
        </button>
        <div className="mb-6 my-8">
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
          <div className="flex gap-1 p-2">
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-xl border ${
                  selectedDays.includes(day)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="my-4" />
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
