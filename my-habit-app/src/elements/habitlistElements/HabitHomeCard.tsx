interface Props {
  title: string;
  checked: boolean;
  toggleCheckIn: () => void;
}

export default function HabitHomeCard({
  title,
  checked,
  toggleCheckIn,
}: Props) {
  return (
    <div className="flex justify-between items-start bg-white p-4 m-4 rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.01] transition-transform cursor-pointer">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`w-3 h-3 rounded-full mt-[6px] flex-shrink-0 ${checked ? "bg-green-500" : "bg-gray-400"}`}
        />

        <span className="text-gray-900 font-bold text-base sm:text-lg capitalize leading-snug break-words max-w-[180px] sm:max-w-[240px] min-w-0">
          {title}
        </span>
      </div>

      <div className="ml-4 flex-shrink-0">
        <button
          aria-label="Complete habit"
          onClick={(e) => {
            e.stopPropagation();
            toggleCheckIn();
          }}
          className={`px-3 py-1 text-sm sm:text-base rounded-xl font-semibold transition-colors border border-black ${
            checked
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white"
          }`}
        >
          {checked ? "Completed" : "Complete"}
        </button>
      </div>
    </div>
  );
}
