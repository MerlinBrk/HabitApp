import { useEffect, useState } from "react";
import { db, type Habit, type HabitLog } from "../lib/db";
import { v4 as uuidv4 } from "uuid";
import { useUserId } from "../services/useUserId";
import IconButton from "../elements/IconButton";
import {
  getHabits,
  deleteHabit,
  getTodaysHabitLogsByUserId,
  getDaysHabitsByUserId,
  getNotDaysHabitsByUserId,
  getHabitLogsByDateAndUserId,
} from "../services/dexieServices";
import { FaCheck } from "react-icons/fa";
import Calendar from "../elements/Calender"; // Assuming you have a Calendar component
import SideBar from "../elements/SideBar";
import { syncAll } from "../lib/sync";
import NewHabitModal from "../elements/NewHabitModal";
import SelectDaysCalendar from "../elements/SelectDays";
import DateSelector from "../elements/DateSelector";

type CheckInMap = {
  [habitId: string]: boolean;
};

export function HabitList({
  onNavigateToUser,
}: {
  onNavigateToUser: () => void;
}) {
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
    // Wenn das aktuelle Datum geändert wird, lade alle Daten neu
    loadAllData();
  }, [currentDate]);


  const loadAllData = async () => {
    await loadHabits();
    await loadTodayCheckIns();
    await loadNotTodaysHabits();
  };
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);// Lade alle Daten neu, wenn das Datum geändert wird

    // Du kannst hier auch API-Calls, Filter oder andere Logik ausführen
  };

  const loadHabits = async () => {
    const data = await getDaysHabitsByUserId(USER_ID, currentDate);
    setHabits(data);
    await loadNotTodaysHabits(); // Load not today's habits after loading today's habits
    // Load not today's habits after loading today's habits
  };

  const loadNotTodaysHabits = async () => {
    const Habits = await getNotDaysHabitsByUserId(USER_ID,currentDate);
    setNotTodaysHabits(Habits);
    if (Habits.length === 0) {
    }
  };

  const loadTodayCheckIns = async () => {
    const today = new Date();
    const logs = await getHabitLogsByDateAndUserId(USER_ID, currentDate

    );

    const map: CheckInMap = {};
    logs.forEach((log) => {
      map[log.habit_id] = log.is_done;
    });

    setCheckInsToday(map);
  };

  const toggleCheckIn = async (habitId: string, isNowDone: boolean) => {
    const restart = activeCalender;
    if (restart) {
      setActiveCalendar(false);
    }
    ;
    const dateIsoWithOffset =
      currentDate
      .toISOString().split("T")[0] + "T00:00:00+00:00";
    const existing = await db.habit_logs
      .where({ habit_id: habitId, user_id: USER_ID, date: dateIsoWithOffset
       })
      .first();

    if (existing) {
      await db.habit_logs.update(existing.id, {
        synced: false,
        is_done: isNowDone,
      });
    } else {
      await db.habit_logs.add({
        id: uuidv4(),
        user_id: USER_ID,
        habit_id: habitId,
        date: dateIsoWithOffset,
        synced: false,
        is_done: isNowDone,
      });
    }

    setCheckInsToday((prev) => ({
      ...prev,
      [habitId]: isNowDone,
    }));
    loadTodayCheckIns();
    if (restart) {
      setActiveCalendar(true);
    }
    SetCurrentCalenderHabitId(habitId);
  };

  const handleDeleteClick = async (habit_id, user_id) => {
    deleteHabit(habit_id, user_id);
    setHabits((prev) => prev.filter((habit) => habit.id !== habit_id));
    setActiveCalendar(false);
    await loadAllData();
  };

  const handleCalenderOpenClick = (habit_id) => {
    if (currentCalenderHabitId === habit_id) {
      setActiveCalendar(!activeCalender);
      SetCurrentCalenderHabitId(null);
    } else {
      setActiveCalendar(true);
      SetCurrentCalenderHabitId(habit_id);
    }
  };

  const handleCalenderCloseClick = () => {
    setActiveCalendar(false);
    SetCurrentCalenderHabitId(null);
  };

  const handleNewHabitClick = () => {
    setNewHabitModalState(true);
  };
  const handleNewHabitClose = () => {
    setNewHabitModalState(false);
    loadHabits(); // Reload habits after adding a new one
    loadNotTodaysHabits(); // Reload not today's habits
  };

  const handleSelectDaysClick = async () => {
    loadHabits();
    loadNotTodaysHabits();
    setActiveCalendar(false);
  };

  return (
    <div className="flex h-screen w-screen">
      <SideBar isOpen={true} onClose={() => {}} />

      <div className="p-4 sm:ml-64 flex-1 bg-white p-6 overflow-auto border-l border-gray-300">
        <DateSelector onDateChange={handleDateChange} />
        <div className="w-full h-full bg-white rounded-none shadow-none p-6 relative">
          {activeCalender ? (
            <div className="flex gap-8">
              {/* Linke Seite: Habits */}
              <div className="flex-1 space-y-3">
                {/* ...Input und Habit-Liste wie gehabt... */}
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition transform cursor-pointer"
                      onClick={() => handleCalenderOpenClick(habit.id)}
                    >
                      <div className="flex items-center gap-3 ">
                        <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                          {habit.title.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-medium text-sm truncate max-w-[160px]">
                          {habit.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(habit.id, USER_ID);
                          }}
                        />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCheckIn(habit.id, !checkInsToday[habit.id]);
                          }}
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
                  <div className="my-2">
                    {notTodaysHabits.length !== 0 && (
                      <button
                        className="flex items-center gap-2 text-sm bg-white text-black border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-100 focus:outline-none"
                        onClick={() => setShowNotTodaysHabits((prev) => !prev)}
                        type="button"
                      >
                        {showNotTodaysHabits ? "▼" : "►"} Nicht heutige Habits
                      </button>
                    )}
                    {showNotTodaysHabits && (
                      <div className="mt-2 space-y-2">
                        {notTodaysHabits.map((habit) => (
                          <div
                            key={habit.id}
                            className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition transform cursor-pointer"
                            onClick={() => handleCalenderOpenClick(habit.id)}
                          >
                            <div className="flex items-center gap-3 ">
                              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                                {habit.title.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-gray-900 font-medium text-sm truncate max-w-[160px]">
                                {habit.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(habit.id, USER_ID);
                                }}
                              />
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCheckIn(
                                    habit.id,
                                    !checkInsToday[habit.id]
                                  );
                                }}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                                  checkInsToday[habit.id]
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-gray-300 border-gray-300 hover:bg-gray-400 text-transparent"
                                }`}
                              >
                                {checkInsToday[habit.id] && (
                                  <FaCheck size={12} />
                                )}
                              </div>
                            </div>
                          </div>
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
            // Normalansicht ohne Split-Screen
            <>
              {/* ...Input und Habit-Liste wie gehabt... */}
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition transform cursor-pointer"
                    onClick={() => {
                      setActiveCalendar(!activeCalender);
                      SetCurrentCalenderHabitId(habit.id);
                    }}
                  >
                    <div className="flex items-center gap-3 ">
                      <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                        {habit.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900 font-medium text-sm truncate max-w-[160px]">
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(habit.id, USER_ID);
                        }}
                      />
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCheckIn(habit.id, !checkInsToday[habit.id]);
                        }}
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

                <div className="my-2">
                  {notTodaysHabits.length !== 0 && (
                    <button
                      className="flex items-center gap-2 text-sm bg-white text-black border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-100 focus:outline-none"
                      onClick={() => setShowNotTodaysHabits((prev) => !prev)}
                      type="button"
                    >
                      {showNotTodaysHabits ? "▼" : "►"} Nicht heutige Habits
                    </button>
                  )}
                  {showNotTodaysHabits && (
                    <div className="mt-2 space-y-2">
                      {notTodaysHabits.map((habit) => (
                        <div
                          key={habit.id}
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition transform cursor-pointer"
                          onClick={() => handleCalenderOpenClick(habit.id)}
                        >
                          <div className="flex items-center gap-3 ">
                            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                              {habit.title.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-900 font-medium text-sm truncate max-w-[160px]">
                              {habit.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(habit.id, USER_ID);
                              }}
                            />
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCheckIn(
                                  habit.id,
                                  !checkInsToday[habit.id]
                                );
                              }}
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
                  )}
                </div>
              </div>
            </>
          )}
          {/* NewHabitModal Overlay */}
          {newHabitModalState && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              {/* Ersetze dies durch dein echtes Modal */}
              <div className="bg-white rounded-xl shadow-2xl p-8 relative min-w-[320px]">
                {/* Hier sollte dein NewHabitModal-Komponent rein */}
                {/* <NewHabitModal onClose={handleNewHabitClose} /> */}
                <button
                  onClick={handleNewHabitClose}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                  ×
                </button>
                <NewHabitModal
                  isActive={newHabitModalState}
                  onClose={handleNewHabitClose}
                />
                {/* Modal-Inhalt hier */}
                {/* ... */}
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={handleNewHabitClick}
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
