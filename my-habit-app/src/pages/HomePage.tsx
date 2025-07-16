import { useState, useEffect } from "react";
import { type Habit } from "../lib/db";
import {
  getDaysHabitsByUserId,
  getNotDaysHabitsByUserId,
  getHabitLogsByDateAndUserId,
  getHabitLogByHabitIdAndDateAndUserId,
  updateHabitLogIsDoneById,
  addHabitLog,
  getUserStreak,
  getPercentageDoneByUserId,
} from "../services/dexieServices";
import { USER_ID } from "../utils/constants";
import HabitHomeCard from "../elements/habitlistElements/HabitHomeCard";
import { syncAll } from "../lib/sync";
import HomeProgressCard from "../elements/habitlistElements/HomeProgressCard";
import { getUsernameBySession } from "../lib/auth";

type CheckInMap = {
  [habitId: string]: boolean;
};

type Tab = "Today" | "All Habits" ;
const tabs: Tab[] = ["Today", "All Habits"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const userName = getUsernameBySession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notDaysHabits, setNotDaysHabits] = useState<Habit[]>([]);
  const [checkInsToday, setCheckInsToday] = useState<CheckInMap>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [todaysHabitAmount, setTodaysHabitAmount] = useState(0);
  const [trueHabitLogs, setTrueHabitLogs] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [userpercentage, setUserPercentage] = useState(0);

  useEffect(() => {
    loadAllData();
    syncAll();
  }, []);

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  useEffect(() => {
    getDailyDoneHabits();
    fetchUserStreak();
    fetchUserDonePercentage();
    syncAll(); // Synchronize data with Supabase when the component mounts
  }, [habits, checkInsToday]);

  useEffect(() => {
    loadAllData();
  }, [currentDate]);

  const loadAllData = () => {
    loadHabits();
    loadNotDaysHabits();
    loadDaysCheckIns();
    fetchUserStreak();
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const loadNotDaysHabits = async () => {
    const data = await getNotDaysHabitsByUserId(USER_ID, currentDate);
    setNotDaysHabits(data);
  };
  const loadHabits = async () => {
    const data = await getDaysHabitsByUserId(USER_ID, currentDate);
    setHabits(data);
    setTodaysHabitAmount(data.length);
  };

  const loadDaysCheckIns = async () => {
    const logs = await getHabitLogsByDateAndUserId(USER_ID, currentDate);
    const map: CheckInMap = {};
    logs.forEach((log) => {
      map[log.habit_id] = log.is_done;
    });
    setCheckInsToday(map);
  };

  const getDailyDoneHabits = () => {
    let trueHabitLogsAmount = 0;

    habits.forEach((log) => {
      if (checkInsToday[log.id] === true) {
        trueHabitLogsAmount++;
      }
    });
    setTrueHabitLogs(trueHabitLogsAmount);
  };

  const fetchUserStreak = async () => {
    const data = await getUserStreak(USER_ID);
    setUserStreak(data);
  };

  const fetchUserDonePercentage = async () => {
    const data = await getPercentageDoneByUserId(USER_ID);
    setUserPercentage(data);
  };

  const toggleCheckIn = async (habitId: string, isNowDone: boolean) => {
    const existing = await getHabitLogByHabitIdAndDateAndUserId(
      habitId,
      currentDate,
      USER_ID
    );

    if (existing) {
      await updateHabitLogIsDoneById(existing.id, isNowDone);
    } else {
      await addHabitLog(USER_ID, habitId, currentDate, isNowDone);
    }

    setCheckInsToday((prev) => ({
      ...prev,
      [habitId]: isNowDone,
    }));
    loadDaysCheckIns();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl overflow-auto hide-scrollbar h-screen mx-auto bg-white flex flex-col gap-6 bg-background p-6 w-full">
      {/* Header */}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your habits and view your progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="inline-flex bg-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
            value={currentDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              handleDateChange(newDate);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Linke Seite: Habit Tracker */}
        <div className="flex-1">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            {/* ... (Habit Tracker Inhalt bleibt wie gehabt) ... */}
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">
                Habit Tracker
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your daily habits and view your progress
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="inline-flex rounded-full bg-[#f4f6f9] p-1">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    aria-label={`Switch to ${tab} tab`}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-white text-black hover:border-white shadow-sm "
                        : "text-gray-500 bg-[#f4f6f9] hover:text-black hover:bg-white hover:border-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {habits.map((habit) => (
              <HabitHomeCard
                key={habit.id}
                title={habit.title}
                checked={checkInsToday[habit.id]}
                toggleCheckIn={() =>
                  toggleCheckIn(habit.id, !checkInsToday[habit.id])
                }
              />
            ))}
            {activeTab === "All Habits"
              ? notDaysHabits.map((habit) => (
                  <HabitHomeCard
                    key={habit.id}
                    title={habit.title}
                    checked={checkInsToday[habit.id]}
                    toggleCheckIn={() =>
                      toggleCheckIn(habit.id, !checkInsToday[habit.id])
                    }
                  />
                ))
              : ""}
          </div>
        </div>
        {/* Rechte Seite: Drei Cards untereinander */}
        <div className="flex flex-col gap-6 w-full md:max-w-xs">
          <HomeProgressCard
            title="Daily Completition"
            value={trueHabitLogs + "/" + todaysHabitAmount}
            progressbar={true}
            icon={false}
            description={
              isNaN(Math.round(100 * (trueHabitLogs / todaysHabitAmount)))
                ? "0% of Habits done"
                : Math.round(100 * (trueHabitLogs / todaysHabitAmount)) +
                  "% of Habits done"
            }
            percentage={
              todaysHabitAmount !== 0
                ? 100 * (trueHabitLogs / todaysHabitAmount)
                : 0
            }
          />
          <HomeProgressCard
            title="Current Streak"
            value={userStreak}
            progressbar={false}
            icon={true}
            description="Keep going to Push your Streak"
            percentage={userStreak}
          />
          <HomeProgressCard
            title="Overall Completition"
            value={userpercentage + "%"}
            progressbar={true}
            icon={false}
            description="Average Completition of all Habits"
            percentage={userpercentage}
          />
        </div>
      </div>
    </div>
  );
}
