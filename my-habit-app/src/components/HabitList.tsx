import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Habit = {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  is_public: boolean;
};

type CheckInMap = {
  [habitId: string]: boolean;
};

export default function HabitList({
  onNavigateToUser,
}: {
  onNavigateToUser: () => void;
}) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [checkInsToday, setCheckInsToday] = useState<CheckInMap>({});

  useEffect(() => {
    loadHabits();
    loadTodayCheckIns();
  }, []);

  const loadHabits = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("Habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Habits:", error);
      return;
    }

    setHabits(data || []);
  };

  const loadTodayCheckIns = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("Habit_logs")
      .select("habit_id, is_done")
      .eq("user_id", user.id)
      .gte("date", `${today}T00:00:00`)
      .lt("date", `${today}T23:59:59`);

    if (error) {
      console.error("Fehler beim Laden der Check-ins:", error);
      return;
    }

    const map: CheckInMap = {};
    data?.forEach((entry) => {
      map[entry.habit_id] = entry.is_done;
    });

    setCheckInsToday(map);
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("Habits").insert([
      {
        user_id: user.id,
        title: newHabit,
        is_public: isPublic,
      },
    ]);

    if (error) {
      console.error("Fehler beim Hinzufügen des Habits:", error);
      return;
    }

    setNewHabit("");
    setIsPublic(false);
    loadHabits();
  };

  const toggleCheckIn = async (habitId: string, isNowDone: boolean) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("Habit_logs").upsert(
      [
        {
          user_id: user.id,
          habit_id: habitId,
          date: `${today}T00:00:00`,
          is_done: isNowDone,
        },
      ],
      { onConflict: "user_id,habit_id,date" }
    );

    if (error) {
      console.error("Fehler beim Speichern des Check-Ins:", error);
      return;
    }

    setCheckInsToday((prev) => ({
      ...prev,
      [habitId]: isNowDone,
    }));
  };

  return (<main className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
  <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 relative">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-center flex-grow">Meine Habits</h1>
      <button
        onClick={onNavigateToUser}
        className="absolute top-4 right-6 text-sm text-blue-600 hover:underline"
      >
        Mein Profil
      </button>
    </div>

    <div className="mb-4">
      <input
        type="text"
        value={newHabit}
        onChange={(e) => setNewHabit(e.target.value)}
        placeholder="Neues Habit"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      <label className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        Öffentlich sichtbar
      </label>
      <button
        onClick={addHabit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Hinzufügen
      </button>
    </div>
    <br />
    <table className="min-w-full table-auto border-separate border-spacing-y-2">
      <thead>
        <tr className="text-left text-gray-600 text-sm">
          <th className="px-4 py-2">Titel</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Öffentlich</th>
        </tr>
      </thead>
      <tbody>
        {habits.map((habit) => (
          <tr
            key={habit.id}
            className="bg-white shadow rounded hover:shadow-md transition-shadow"
          >
            <td className="px-4 py-3 font-medium text-gray-800">{habit.title}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => toggleCheckIn(habit.id, !checkInsToday[habit.id])}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  checkInsToday[habit.id]
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                {checkInsToday[habit.id] ? "Erledigt" : "Noch offen"}
              </button>
            </td>
            <td className="px-4 py-3">
              {habit.is_public ? (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  öffentlich
                </span>
              ) : (
                <span className="text-xs text-gray-400 italic">privat</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</main>

  );
}
