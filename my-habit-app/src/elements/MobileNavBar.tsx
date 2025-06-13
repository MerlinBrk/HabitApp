
interface MobileNavbarProps {
    currentView: "habits" | "user";
    setCurrentView: (view: "habits" | "user") => void;
}

export default function MobileNavbar({ currentView, setCurrentView }: MobileNavbarProps) {
    return (
        <div className="w-full bg-white border-t p-2 flex justify-around fixed bottom-0 left-0 right-0 md:hidden">
            <button
                onClick={() => setCurrentView("habits")}
                className={currentView === "habits" ? "text-blue-700 font-bold" : "text-blue-500"}
            >
                Habits
            </button>
            <button
                onClick={() => setCurrentView("user")}
                className={currentView === "user" ? "text-blue-700 font-bold" : "text-blue-500"}
            >
                User
            </button>
        </div>
    );
}
