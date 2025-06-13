import { useEffect, useState } from "react";
import { db, type Habit, type HabitLog } from "../lib/db";
import { v4 as uuidv4 } from "uuid";
import { useUserId } from "../services/useUserId";
import IconButton from "../elements/IconButton";
import {
  getHabits,
  deleteHabit,
  getDaysHabitsByUserId,
  getNotDaysHabitsByUserId,
  getHabitLogsByDateAndUserId,
  getHabitLogByHabitIdAndDateAndUserId,
  updateHabitLogIsDoneById,
  addHabitLog,
} from "../services/dexieServices";
import { FaCheck } from "react-icons/fa";
import Calendar from "../elements/Calender"; // Assuming you have a Calendar component
import SideBar from "../elements/SideBar";
import { syncAll } from "../lib/sync";
import NewHabitModal from "../elements/NewHabitModal";
import SelectDaysCalendar from "../elements/SelectDays";
import DateSelector from "../elements/DateSelector";
import SmallHabitCard from "../elements/habitlistElements/SmallHabitCard";
import DropDownButton from "../elements/habitlistElements/DropDownButton";

type CheckInMap = {
  [habitId: string]: boolean;
};

export function HabitList() {
  const [showNotTodaysHabits, setShowNotTodaysHabits] = useState(true);
  const [notTodaysHabits, setNotTodaysHabits] = useState<Habit[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkInsToday, setCheckInsToday] = useState<CheckInMap>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeCalender, setActiveCalendar] = useState(false);
  const [newHabitModalState, setNewHabitModalState] = useState(false);
  const [currentCalenderHabitId, SetCurrentCalenderHabitId] = useState<
    string | null
  >(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const USER_ID = useUserId();

  useEffect(() => {
    loadAllData();
    //syncAll();
  }, []);

  useEffect(() => {
    if (activeCalender && !showNotTodaysHabits) {
      setActiveCalendar(false);
      SetCurrentCalenderHabitId(null);
    }
  }, [showNotTodaysHabits]);

  useEffect(() => {
    loadAllData();
  }, [currentDate]);

  const loadAllData = async () => {
    await loadHabits();
    await loadDaysCheckIns();
    await loadNotNeededHabits();
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const loadHabits = async () => {
    const data = await getDaysHabitsByUserId(USER_ID, currentDate);
    setHabits(data);
    await loadNotNeededHabits();
  };

  const loadNotNeededHabits = async () => {
    const Habits = await getNotDaysHabitsByUserId(USER_ID, currentDate);
    setNotTodaysHabits(Habits);
  };

  const loadDaysCheckIns = async () => {
    const logs = await getHabitLogsByDateAndUserId(USER_ID, currentDate);

    const map: CheckInMap = {};
    logs.forEach((log) => {
      map[log.habit_id] = log.is_done;
    });

    setCheckInsToday(map);
  };

  const toggleCheckIn = async (habitId: string, isNowDone: boolean) => {
    const restart = activeCalender;
    if (restart) setActiveCalendar(false);

    const existing = await getHabitLogByHabitIdAndDateAndUserId(habitId,currentDate,USER_ID);

    if (existing) {
      await updateHabitLogIsDoneById(existing.id,isNowDone);
    } else {
      await addHabitLog(USER_ID,habitId,currentDate,isNowDone);
    }

    setCheckInsToday((prev) => ({
      ...prev,
      [habitId]: isNowDone,
    }));
    loadDaysCheckIns();
    if (restart) setActiveCalendar(true);

    SetCurrentCalenderHabitId(habitId);
  };

  const handleDeleteHabit = async (habit_id, user_id) => {
    deleteHabit(habit_id, user_id);
    setHabits((prev) => prev.filter((habit) => habit.id !== habit_id));
    setActiveCalendar(false);
    await loadAllData();
  };

  const handleCalenderOpenClick = (habit_id) => {
    if (currentCalenderHabitId === habit_id) {
      handleCalenderCloseClick();
    } else {
      setActiveCalendar(true);
      SetCurrentCalenderHabitId(habit_id);
    }
  };

  const handleCalenderCloseClick = () => {
    setActiveCalendar(false);
    SetCurrentCalenderHabitId(null);
  };

  const handleNewHabitModalClick = () => {
    setNewHabitModalState(true);
  };
  const handleNewHabitModalClose = () => {
    setNewHabitModalState(false);
    loadAllData();
  };

  return (
    <div className="flex h-screen w-screen">
      <SideBar isOpen={true} onClose={() => {}} />
        {/*Seite mit Splitscreen */}
      <div className="p-4 sm:ml-64 flex-1 bg-white p-6 overflow-auto border-l border-gray-300">
        <DateSelector onDateChange={handleDateChange} />
        <div className="w-full h-full bg-white rounded-none shadow-none p-6 relative">
          {activeCalender ? (
            <div className="flex gap-8">
              <div className="flex-1 space-y-3">
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <SmallHabitCard
                      key={habit.id}
                      title={habit.title}
                      checked={checkInsToday[habit.id]}
                      handleCalenderOpenClick={() =>
                        handleCalenderOpenClick(habit.id)
                      }
                      handleDeleteClick={() =>
                        handleDeleteHabit(habit.id, USER_ID)
                      }
                      toggleCheckIn={() =>
                        toggleCheckIn(habit.id, !checkInsToday[habit.id])
                      }
                    />
                  ))}
                  <div className="my-2">
                    {notTodaysHabits.length !== 0 && (
                      <DropDownButton
                        onClick={() => setShowNotTodaysHabits((prev) => !prev)}
                        isActive={showNotTodaysHabits} />
                    )}
                    {showNotTodaysHabits && (  
                    <div className="mt-2 space-y-2">
                      {notTodaysHabits.map((habit) => (
                        <SmallHabitCard
                          key={habit.id}
                          title={habit.title}
                          checked={checkInsToday[habit.id]}
                          handleCalenderOpenClick={() =>
                            handleCalenderOpenClick(habit.id)
                          }
                          handleDeleteClick={() =>
                            handleDeleteHabit(habit.id, USER_ID)
                          }
                          toggleCheckIn={() =>
                            toggleCheckIn(habit.id, !checkInsToday[habit.id])
                          }
                        />
                      ))}
                    </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Vertikale Linie zur Trennung */}
              <div className="h-auto w-px bg-gray-300 self-stretch" />

              <div className="flex-1 flex flex-col items-center justify-start gap-4">
                <Calendar
                  isActive={activeCalender}
                  selected={selectedDate}
                  habitId={currentCalenderHabitId || ""}
                  onSelect={setSelectedDate}
                  onClose={handleCalenderCloseClick}
                />
                <SelectDaysCalendar
                  habitId={currentCalenderHabitId || ""}
                  onClick={loadHabits}
                />
              </div>
            </div>
          ) : (
            <>
              {/*Normale Ansicht ohne Split-Screen / Nur Habits */}
              <div className="space-y-3">
                {habits.map((habit) => (
                  <SmallHabitCard
                    key={habit.id}
                    title={habit.title}
                    checked={checkInsToday[habit.id]}
                    handleCalenderOpenClick={() =>
                      handleCalenderOpenClick(habit.id)
                    }
                    handleDeleteClick={() =>
                      handleDeleteHabit(habit.id, USER_ID)
                    }
                    toggleCheckIn={() =>
                      toggleCheckIn(habit.id, !checkInsToday[habit.id])
                    }
                  />
                ))}

                <div className="my-2">
                  {notTodaysHabits.length !== 0 && (
                    <DropDownButton onClick={() => setShowNotTodaysHabits((prev) => !prev)} isActive={showNotTodaysHabits} />
                    
                  )}
                  {showNotTodaysHabits && (
                    
                  
                  <div className="mt-2 space-y-2">
                    {notTodaysHabits.map((habit) => (
                      <SmallHabitCard
                        key={habit.id}
                        title={habit.title}
                        checked={checkInsToday[habit.id]}
                        handleCalenderOpenClick={() =>
                          handleCalenderOpenClick(habit.id)
                        }
                        handleDeleteClick={() =>
                          handleDeleteHabit(habit.id, USER_ID)
                        }
                        toggleCheckIn={() =>
                          toggleCheckIn(habit.id, !checkInsToday[habit.id])
                        }
                      />
                    ))}
                    
                  </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* NewHabitModal Overlay */}
          {newHabitModalState && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-2xl p-8 relative min-w-[320px]">
                <NewHabitModal
                  isActive={newHabitModalState}
                  onClose={handleNewHabitModalClose}
                />
                
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={handleNewHabitModalClick}
            className="bg-primary bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-2xl hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="Neues Habit hinzufügen"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
