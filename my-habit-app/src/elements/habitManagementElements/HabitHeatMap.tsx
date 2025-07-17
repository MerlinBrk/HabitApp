import {useEffect, useState} from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {getHabitCompletionMap, getHabitLogCountForYear} from "../../services/dexieServices.ts";

interface HabitHeatMapProps {
    habitId: string;
}

export default function HabitHeatMap({habitId}: HabitHeatMapProps) {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [completionMap, setCompletionMap] = useState<Record<string, boolean>>({});
    const [yearlyHabitCount, setYearlyHabitCount] = useState<number>(0);

    useEffect(() => {
        fetchYearlyHabitCount();
        fetchData();
    }, [habitId, year]);

    async function fetchData() {
        const map = await getHabitCompletionMap(habitId, year);
        setCompletionMap(map);
    }

    const fetchYearlyHabitCount = async () => {
        const data = await getHabitLogCountForYear(habitId, year);
        setYearlyHabitCount(data);

    }

    const heatmapValues = Object.entries(completionMap).map(([date, completed]) => ({
        date,
        count: completed ? 1 : 0,
    }));


    return (

        <div className="heatmap-container">
            <div className="header">

                <label htmlFor="year-select">Selected Year: </label>
                <select
                    id="year-select"
                    className="p-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-black-500"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {Array.from({length: 5}).map((_, idx) => {
                        const optionYear = currentYear - idx;
                        return (
                            <option key={optionYear} value={optionYear}>
                                {optionYear}
                            </option>
                        );
                    })}
                </select>
            </div>

            <CalendarHeatmap
                startDate={`${year}-01-01`}
                endDate={`${year}-12-31`}
                values={heatmapValues}
                classForValue={(value) => {
                    if (!value || value.count === undefined) return "color-empty";
                    return value.count > 0 ? "color-complete" : "color-empty";
                }}
                titleForValue={(value) => {
                    if (!value || !value.date) return "";
                    const status = value.count > 0 ? "Completed" : "Not Completed";
                    return `${value.date.split("T")[0]}: ${status}`;
                }}
            />

            <div className="text-xs text-muted-foreground pt-4">
                You've completed this habit {yearlyHabitCount} times in {year}.
            </div>


            <style jsx>{`
                .heatmap-container {
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 1.5rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .header {
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                }

                .react-calendar-heatmap text {
                    font-size: 9px;
                }

                .color-empty {
                    fill: #e0e0e0;
                }

                .color-complete {
                    fill: #4caf50;
                }


                .react-calendar-heatmap rect {
                    stroke: #fff;
                    rx: 3px;
                    ry: 3px;
                }
            `}</style>
        </div>
    );
}
