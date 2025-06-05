import { useEffect, useState } from "react";
import { db, type Habit, type HabitLog } from "../lib/db";
import ColorPicker from "./ColorPicker";
import { v4 as uuidv4 } from "uuid";
import { useUserId } from "../services/useUserId";
import IconButton from "../elements/IconButton";
import { deleteHabit } from "../services/dexieServices";
import { FaCheck } from "react-icons/fa";
import Calendar from "../elements/Calender"; // Assuming you have a Calendar component

type CheckInMap = {
  [habitId: string]: boolean;
};

export function HabitList({
  onNavigateToUser,
}: {
  onNavigateToUser: () => void;
}) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [checkInsToday, setCheckInsToday] = useState<CheckInMap>({});
  const [selectedDays, setSelectedDays] = useState<String[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeCalender, setActiveCalendar] = useState(false);

  const USER_ID = useUserId();

  useEffect(() => {
    loadHabits();
    loadTodayCheckIns();
  }, []);

  const loadHabits = async () => {
    const data = await db.habits
      .where("user_id")
      .equals(USER_ID)
      .reverse()
      .sortBy("created_at");
    setHabits(data);
  };

  const loadTodayCheckIns = async () => {
    const today = new Date().toISOString().split("T")[0];
    const logs = await db.habit_logs
      .where("user_id")
      .equals(USER_ID)
      .filter((log) => log.date.startsWith(today))
      .toArray();

    const map: CheckInMap = {};
    logs.forEach((log) => {
      map[log.habit_id] = log.is_done;
    });

    setCheckInsToday(map);
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return;

    const habit: Habit = {
      id: uuidv4(),
      user_id: USER_ID,
      title: newHabit,
      created_at: new Date().toISOString(),
      is_public: isPublic,
      synced: false,
      days: selectedDays,
    };

    await db.habits.add(habit);
    setNewHabit("");
    setIsPublic(false);
    setSelectedDays([]);
    loadHabits();
  };

  const toggleCheckIn = async (habitId: string, isNowDone: boolean) => {
    const today = new Date().toISOString().split("T")[0];

    const existing = await db.habit_logs
      .where({ user_id: USER_ID, habit_id: habitId, date: `${today}T00:00:00` })
      .first();

    if (existing) {
      await db.habit_logs.update(existing.id!, { is_done: isNowDone });
    } else {
      await db.habit_logs.add({
        id: uuidv4(),
        user_id: USER_ID,
        habit_id: habitId,
        date: `${today}T00:00:00`,
        synced: false,
        is_done: isNowDone,
      });
    }

    setCheckInsToday((prev) => ({
      ...prev,
      [habitId]: isNowDone,
    }));
  };

  const handleDeleteClick = (habit_id, user_id) => {
    deleteHabit(habit_id, user_id);
    setHabits((prev) => prev.filter((habit) => habit.id !== habit_id));
  };

  return (
    <main className="bg-gray-300 h-screen w-screen p-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] flex items-center justify-center">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 relative">
        
    

    <Calendar
      isActive={activeCalender}
      selected={selectedDate}
      onSelect={setSelectedDate}
      onClose={() => setActiveCalendar(false)}
    />

        {!activeCalender ? 
        <>
        <button
          onClick={onNavigateToUser}
          className="absolute top-4 right-4 bg-black text-white text-sm px-3 py-1 rounded-xl shadow hover:bg-gray-800 transition"
        >
          Mein Profil
        </button>

        <ColorPicker />

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
            className="w-full bg-primary text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Hinzufügen
          </button>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => (
            
            <div
              key={habit.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm"
              onClick={() => setActiveCalendar(!activeCalender)}
            >
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                  {habit.title.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-900 font-medium text-sm truncate max-w-[160px]">
                  {habit.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={() => handleDeleteClick(habit.id, USER_ID)}
                />
                <div
                  onClick={() =>
                    toggleCheckIn(habit.id, !checkInsToday[habit.id])
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                    checkInsToday[habit.id]
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-300 border-gray-300 hover:bg-gray-400 text-transparent"
                  }`}
                >
                  {checkInsToday[habit.id] && <FaCheck size={12} />}
                </div>

                
              </div>
            </div>
          ))}
        </div>
        </>:""
}
      </div>
    </main>
  );
}
