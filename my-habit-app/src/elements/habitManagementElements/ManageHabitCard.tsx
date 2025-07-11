import {useState, useEffect} from "react";
import {
    getLongestStreakByHabitId,
    getPercentageDoneByHabitId,
    getStreakByHabitId
} from "../../services/dexieServices.ts";
import AnalyticsModal from "./AnalyticsModal.tsx";

interface ManageHabitProps {
    habitTitle: string;
    description: string;
    habitId: string;
    userId: string;
    days: string[];
    openEditHabitModal: () => {};
    handleDeleteHabit: () => {};
    openAnalyticsModal: () => {};
}

export default function ManageHabitCard({
                                            habitTitle,
                                            description,
                                            habitId,
                                            userId,
                                            days,
                                            openEditHabitModal,
                                            handleDeleteHabit,
                                        }: ManageHabitProps) {
    const [openMoreDetails, setOpenMoreDetails] = useState(false);
    const [habitStreak, setHabitStreak] = useState(0);
    const [longestHabitStreak, setLongestHabitStreak] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [openAnalyticsModal, setOpenAnalyticsModal] = useState(false);


    useEffect(() => {
        fetchPercentage();
        fetchHabitStreak();
        fetchLongestHabitStreak();
    }, [])

    const handleOpenMoreClick = () => {
        setOpenMoreDetails(!openMoreDetails);
    };

    const handleOpenAnalyticsModal = () => {
        setOpenAnalyticsModal(true);
    }

    const handleCloseAnalyticsModal = () => {
        setOpenAnalyticsModal(false);
    }

    const fetchPercentage = async () => {
        const data = await getPercentageDoneByHabitId(habitId, userId);
        console.log(data);
        setPercentage(data);
    }

    const fetchHabitStreak = async () => {
        const data = await getStreakByHabitId(habitId);
        setHabitStreak(data);
    }

    const fetchLongestHabitStreak = async () => {
        const data = await getLongestStreakByHabitId(habitId);
        setLongestHabitStreak(data);
    }
    return (
        <div className="rounded-xl border text-card-foreground shadow bg-card">
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold leading-none tracking-tight flex items-center">
                            {habitTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {description}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            title="Edit habit"
                            className="bg-white hover:border-white inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-square-pen h-4 w-4"
                            >
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path
                                    d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                            </svg>
                        </button>
                        <button
                            title="Delete habit" onClick={handleDeleteHabit}
                            className="bg-white hover:border-white inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash2 h-4 w-4"
                            >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                        </button>
                        <button
                            title="Expand habit details"
                            onClick={handleOpenMoreClick}
                            className="bg-white hover:border-white inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-bar-chart mr-2 h-4 w-4"
                            >
                                <line x1="12" x2="12" y1="20" y2="10"></line>
                                <line x1="18" x2="18" y1="20" y2="4"></line>
                                <line x1="6" x2="6" y1="20" y2="16"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-0">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-calendar h-4 w-4 mr-2 text-muted-foreground"
                        >
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span className="text-sm">{days}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-bell h-4 w-4 ml-4 mr-2 text-muted-foreground"
                        >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                        </svg>
                        <span className="text-sm">07:00</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Streak: {habitStreak} days</span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                        <span>Completion Rate</span>
                        <span>{percentage}%</span>
                    </div>
                    <div
                        aria-valuemax="100"
                        aria-valuemin="0"
                        role="progressbar"
                        data-state="indeterminate"
                        data-max="100"
                        className="relative w-full overflow-hidden rounded-full bg-primary/20 h-2"
                    >
                        <div
                            data-state="indeterminate"
                            data-max="100"
                            className="h-full w-full flex-1 bg-primary transition-all"
                        ></div>
                    </div>
                </div>
                <button
                    className="bg-white inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs mt-4 w-full"
                    onClick={handleOpenAnalyticsModal}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-bar-chart mr-2 h-4 w-4"
                    >
                        <line x1="12" x2="12" y1="20" y2="10"></line>
                        <line x1="18" x2="18" y1="20" y2="4"></line>
                        <line x1="6" x2="6" y1="20" y2="16"></line>
                    </svg>
                    {" "}
                    View Detailed Analytics
                </button>
                {openMoreDetails &&
                    (
                        <>
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-2">Analytics</h4>
                                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                                    <div className="bg-muted/50 p-3 rounded-md border shadow">
                                        <div className="text-xs text-muted-foreground">
                                            Current Streak
                                        </div>
                                        <div className="text-xl font-bold">{habitStreak}</div>
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-md border shadow">
                                        <div className="text-xs text-muted-foreground">
                                            Longest Streak
                                        </div>
                                        <div className="text-xl font-bold">{longestHabitStreak}</div>
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-md border shadow">
                                        <div className="text-xs text-muted-foreground">
                                            Current Streak
                                        </div>
                                        <div className="text-xl font-bold">{habitStreak}</div>
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-md border shadow">
                                        <div className="text-xs text-muted-foreground">
                                            Completion Rate
                                        </div>
                                        <div className="text-xl font-bold">{percentage}%</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                {openAnalyticsModal &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-xl shadow-2xl p-8 relative min-w-[320px]">
                            <AnalyticsModal habitStreak={habitStreak} longestHabitStreak={longestHabitStreak}
                                            completionRate={percentage} isActive={openAnalyticsModal}
                                            onClose={handleCloseAnalyticsModal}/>

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
