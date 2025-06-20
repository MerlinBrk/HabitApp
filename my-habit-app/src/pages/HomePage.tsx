import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useUserName } from "../services/useUserId";
import { type Habit } from "../lib/db";
import { useUserId } from "../services/useUserId";
import {
  deleteHabit,
  getDaysHabitsByUserId,
  getNotDaysHabitsByUserId,
  getHabitLogsByDateAndUserId,
  getHabitLogByHabitIdAndDateAndUserId,
  updateHabitLogIsDoneById,
  addHabitLog,
  getHabits,
} from "../services/dexieServices";
import SmallHabitCard from "../elements/habitlistElements/SmallHabitCard";
import DropDownButton from "../elements/habitlistElements/DropDownButton";
import { USER_ID } from "../utils/constants";
import HabitHomeCard from "../elements/habitlistElements/HabitHomeCard";

type CheckInMap = {
  [habitId: string]: boolean;
};

type Tab = "Today" | "All Habits" | "Calendar";
const tabs: Tab[] = ["Today", "All Habits", "Calendar"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const userName = useUserName();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notDaysHabits,setNotDaysHabits] = useState<Habit[]>([]);
  const [checkInsToday, setCheckInsToday] = useState<CheckInMap>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [todaysHabitAmount, setTodaysHabitAmount] = useState(0);
  const [trueHabitLogs, setTrueHabitLogs] = useState(0);

  useEffect(() => {
    loadAllData();
    //syncAll();
  }, []);

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  useEffect(() => {
getDailyDoneHabits();
  },[habits,checkInsToday]);

  const loadAllData = () => {
      loadHabits(); 
      loadNotDaysHabits();
    loadDaysCheckIns();
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const loadNotDaysHabits = async () => {
    const data = await getNotDaysHabitsByUserId(USER_ID,currentDate);
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
    })
    setCheckInsToday(map);
  };

  const getDailyDoneHabits = () => {
    let trueHabitLogsAmount = 0;
    
    habits.forEach((log) => {
      if(checkInsToday[log.id] === true){
        trueHabitLogsAmount++;
      }
    });
    setTrueHabitLogs(trueHabitLogsAmount);
  
  }

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
    <div className="p-6 md:p-8 max-w-6xl mx-auto bg-white flex flex-col gap-6 bg-background p-6 w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to HabitHub, {userName}!</h1>
        <p className="text-gray-600 mt-1">Goal Tracker</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-6 ">
        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-2 row-span-3">
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
          {activeTab === "All Habits" ? 
            notDaysHabits.map((habit) => (
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
        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-1">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Daily Completion
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold pb-2">
              {trueHabitLogs}/{todaysHabitAmount}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-black h-full transition-all duration-500 ease-in-out"
                style={{ width: `${100*(trueHabitLogs/todaysHabitAmount)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                {Math.round(100 * (trueHabitLogs / todaysHabitAmount))}% of Habits done
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-1">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Current Streak
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">10</div>
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              role="progressbar"
              data-state="indeterminate"
              data-max="100"
              className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20 mt-2"
            >
              <div
                data-state="indeterminate"
                data-max="100"
                className="h-full w-full flex-1 bg-primary transition-all tempo-e664fefe-fa52-579a-92ad-6c35279a5bcc"
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {" "}
              50% of Habits done
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-1">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Overall Completion
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">75%</div>
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              role="progressbar"
              data-state="indeterminate"
              data-max="100"
              className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20 mt-2"
            >
              <div
                data-state="indeterminate"
                data-max="100"
                className="h-full w-full flex-1 bg-black transition-all"
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {" "}
              Average Completition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
