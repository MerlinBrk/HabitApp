import React, { useState , useEffect} from "react";
import { db } from "../lib/db"; // Adjust the import path as necessary
import { WEEKDAYS } from "../utils/constants";


interface SelectDaysCalendarProps {
  habitId: string;
  onClick: () => void; // Callback function to close the modal or perform any other action
}

export default function SelectDaysCalendar({habitId, onClick}: SelectDaysCalendarProps) {
  const [selectedDays, setSelectedDays] = useState([]);


  useEffect(() => {
    addSelectedDaysToHabit();
  }, [selectedDays]);

    useEffect(() => {
    fetchSelectedDays();
  }, [habitId]);

const fetchSelectedDays = async () => {
      const habit = await db.habits.get(habitId);
      if (habit && habit.days) {
        setSelectedDays(habit.days);
      }
    };
    const addSelectedDaysToHabit = async () => {
    if (selectedDays.length === 0) return;
    
    await db.habits.update(habitId, {
      days: selectedDays,
    });
    onClick(); 
    // Call the onClick function to close the modal or perform any other action
}

const toggleDay = async(day) => {
    
    setSelectedDays((prev) => {
        const newDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
         // Update the database with the new selection
        return newDays;
    });
};

  return (
    <div className="flex gap-2 p-4">
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
  );
}
