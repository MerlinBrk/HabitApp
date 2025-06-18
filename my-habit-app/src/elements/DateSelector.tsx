import React, { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";

interface DateSelectorProps {
  onDateChange: (date: Date) => void;
}


export default function DateSelector({ onDateChange }: DateSelectorProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isToday, setIsToday] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false); // Kalender-Visibility-Status

    useEffect(() => {
        onDateChange(selectedDate);
        setIsToday(format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"));
    }, [selectedDate, onDateChange]);

    const goToPreviousDay = () => {
        setSelectedDate(prev => subDays(prev, 1));
    };

    const goToNextDay = () => {
        setSelectedDate(prev => addDays(prev, 1));
    };

    return (
        <div className="flex items-center justify-center gap-4 p-4 relative">
            <button
                onClick={goToPreviousDay}
                className="text-xl px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
                ◀
            </button>

            <button
                className="text-lg font-medium px-2 py-1 rounded-xl bg-gray-100 hover:bg-gray-100 focus:outline-none"
                onClick={() => setShowCalendar(true)}
                type="button"
            >
                {isToday ? "Heute" : format(selectedDate, "dd.MM.yyyy")}
            </button>
            {showCalendar && (
                <div className="absolute z-10 mt-2 border rounded-xl bg-white shadow-lg p-2">
                    <input
                        type="date"
                        value={format(selectedDate, "yyyy-MM-dd")}
                        onChange={e => {
                            setSelectedDate(new Date(e.target.value));
                            setShowCalendar(false);
                        }}
                        className="border rounded-xl px-2 py-1 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onBlur={() => setShowCalendar(false)}
                    />
                </div>
            )}

            <button
                onClick={goToNextDay}
                className="text-xl px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
                ▶
            </button>
        </div>
    );
};

