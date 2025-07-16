import ManageHabitCard from "../elements/habitManagementElements/ManageHabitCard.tsx";
import { useEffect, useState } from "react";
import { type Habit } from "../lib/db";
import { deleteHabit, getHabits } from "../services/dexieServices";
import NewHabitModal from "../elements/habitManagementElements/NewHabitModal.tsx";
import { syncAll } from "../lib/sync";

import { USER_ID } from "../utils/constants";

type Tab = "All Habits" | "Daily" | "Weekly" | "Monthly";
const tabs: Tab[] = ["All Habits", "Daily", "Weekly", "Monthly"];

export default function ManagementPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("All Habits");
  const [openNewHabitModal, setOpenNewHabitModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    loadHabits();
    syncAll(); // Synchronize data with Supabase when the component mounts
  }, [habits, openNewHabitModal]);

  const loadHabits = async () => {
    const data = await getHabits(USER_ID);
    setHabits((prev) =>
      JSON.stringify(prev) !== JSON.stringify(data) ? data : prev
    );
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabit(habitId, USER_ID);
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId)); // Remove from UI
  };

  const handleOpenNewHabitModal = () => {
    setOpenNewHabitModal(true);
  };
  const handleCloseNewHabitModal = () => {
    setOpenNewHabitModal(false);
  };

  const getFilteredHabits =
    searchKey === ""
      ? habits
      : habits.filter((habit) =>
          habit.title.toLowerCase().includes(searchKey.toLowerCase())
        );

  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Habit Management</h1>
          <button
            aria-label="Create new habit"
            onClick={handleOpenNewHabitModal}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 text-bold"
          >
            + Create New Habit
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              placeholder="Suche nach einem Habit..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            ></input>
          </div>
        </div>
        <div>
          <div className="inline-flex rounded-full bg-[#f4f6f9] p-1">
            {tabs.map((tab) => (
              <button
                aria-label={`Switch to ${tab} tab`}
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors font-sans ${
                  activeTab === tab
                    ? "bg-white text-black font-bold hover:border-white"
                    : "text-gray-500 bg-[#f4f6f9] hover:text-black hover:bg-white hover:border-white"
                }`}
                style={{
                  ...(activeTab === tab ? { fontWeight: 700 } : {}),
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            {getFilteredHabits.map((habit) => (
              <ManageHabitCard
                key={habit.id}
                habitId={habit.id}
                description={habit.description}
                habitTitle={habit.title}
                days={habit.days ?? []}
                openEditHabitModal={() => {}}
                handleDeleteHabit={() => handleDeleteHabit(habit.id)}
                openAnalyticsModal={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
      {openNewHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 relative min-w-[320px]">
            <NewHabitModal
              isActive={openNewHabitModal}
              onClose={handleCloseNewHabitModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
