import {useEffect, useState} from "react";
import {WEEKDAYS} from "../../utils/constants.tsx";
import {editHabitInDB, getHabitById} from "../../services/dexieServices.ts";

interface EditHabitModalProps {
    habitId: string;
    isActive: boolean;
    onClose: () => void;
}

export default function EditHabitModal({habitId, isActive, onClose}: EditHabitModalProps) {
    const [title, setTitle] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [description, setDescription] = useState("");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    useEffect(() => {
        fetchHabitData()
    }, [isActive])

    async function fetchHabitData() {
        try {
            const data = await getHabitById(habitId);
            if (!data) return;
            setTitle(data.title);
            setDescription(data.description);
            setIsPublic(data.is_public);
            setSelectedDays(data.days && data.days.length > 0 ? data.days : WEEKDAYS.slice(0, 7));
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSave() {
        try {
            await editHabitInDB(habitId, title, description, selectedDays, isPublic);
            onClose();
        } catch (error) {
            console.error(error);
        }
    }


    const toggleDay = (day: string) => {
        setSelectedDays((prev) => {
            let updated = prev.includes(day)
                ? prev.filter((d) => d !== day)
                : [...prev, day];

            // Put the days in the correct order (Mo - So)
            updated.sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
            return updated;
        });
    };
    if (!isActive) return null;

    return (
        <div
            role="dialog"
            id="radix-:rr:"
            aria-describedby="radix-:rt:"
            aria-labelledby="radix-:rs:"
            data-state="open"
            tabIndex={-1}
            className="fixed bg-white left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[500px] pointer-events-auto"
        >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2
                    id="radix-:rs:"
                    className="text-lg font-semibold leading-none tracking-tight"
                >
                    Edit Habit
                </h2>
                <p id="radix-:rt:" className="text-sm text-muted-foreground">
                    Modify your Habit! Fill in the details below.
                </p>
            </div>
            <form>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name"
                        >
                            Habit Name
                        </label>
                        <input
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            id="name"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="description"
                        >
                            Description
                        </label>
                        <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            id="description"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex items-center space-x-2 relative">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isPublic ? "true" : "false"}
                            data-state={isPublic ? "checked" : "unchecked"}
                            value="on"
                            className={`peer inline-flex h-5 w-9 border-black shrink-0 cursor-pointer items-center rounded-full border-2 shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                                isPublic ? "bg-black" : "bg-input"
                            }`}
                            id="isPrivate"
                            onClick={() => setIsPublic((v) => !v)}
                        >
              <span
                  data-state={isPublic ? "checked" : "unchecked"}
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                      isPublic ? "translate-x-4" : "translate-x-0 "
                  }`}
              ></span>
                        </button>
                        <input
                            type="checkbox"
                            aria-hidden="true"
                            tabIndex={-1}
                            value="on"
                            className="absolute left-0 top-0 w-9 h-5 opacity-0 pointer-events-none m-0"
                            checked={isPublic}
                            readOnly
                        />
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="isPrivate"
                        >
                            Make this habit private
                        </label>
                    </div>

                    <div className="grid gap-2">
                        <label
                            className="text-sm font-medium leading-none"
                            htmlFor="weekdays"
                        >
                            Days of the Week
                        </label>
                        <div className="flex flex-wrap gap-2" id="weekdays">
                            {WEEKDAYS.map((day) => (
                                <button
                                    type="button"
                                    key={day}
                                    className={`px-3 py-1 rounded-md border text-sm transition-colors ${
                                        selectedDays.includes(day)
                                            ? "bg-black text-white border-primary"
                                            : "bg-background text-foreground border-input"
                                    }`}
                                    aria-pressed={selectedDays.includes(day)}
                                    onClick={() => toggleDay(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        Save
                    </button>
                </div>
            </form>
            <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={onClose}
            >
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                >
                    <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <span className="sr-only">Close</span>
            </button>
        </div>
    );
}
