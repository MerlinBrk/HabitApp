import HabitHeatMap from "./HabitHeatMap.tsx";

interface AnalyticsProps {
    habitId: string;
    habitStreak: number;
    longestHabitStreak: number;
    completionRate: number;
    isActive: boolean;
    onClose: () => void;
}

export default function AnalyticsModal({
                                           habitId,
                                           habitStreak,
                                           longestHabitStreak,
                                           completionRate,
                                           isActive,
                                           onClose
                                       }: AnalyticsProps) {

    if (!isActive) return;

    return (
        <div
            role="dialog"
            aria-describedby="analytics-description"
            aria-labelledby="analytics-title"
            tabIndex={-1}
            className="fixed bg-white left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[900px] pointer-events-auto"
        >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2
                    id="analytics-title"
                    className="text-lg font-semibold leading-none tracking-tight"
                >
                    Habit Analytics
                </h2>
                <p id="analytics-description" className="text-sm text-muted-foreground">
                    Overview of your habits and progress.
                </p>
            </div>

            <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Analytics</h4>
                <div className="grid grid-cols-3 grid-rows-1 gap-4">
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
                            Completion Rate
                        </div>
                        <div className="text-xl font-bold">{completionRate}%</div>
                    </div>
                </div>
                <HabitHeatMap habitId={habitId}/>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>

            <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={onClose}
                aria-label="Close"
            >
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}