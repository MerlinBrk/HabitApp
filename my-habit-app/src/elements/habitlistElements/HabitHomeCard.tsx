import { FaCheck } from "react-icons/fa";
import IconButton from "../IconButton"; // falls du eine eigene Komponente hast
import React from "react";



interface Props{
  title: string;
  checked: boolean;
  toggleCheckIn: () => void;
};

export default function HabitHomeCard({
  title,
  checked,
  toggleCheckIn,
}: Props) {
  return (
    <div
      className="flex items-center justify-between bg-white p-4 m-4 rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.01] transition transform cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${checked ? "bg-green-500" : "bg-gray-400"}`}></div>
        <div>
        <span className="ml-4 text-gray-900 font-bold text-xl truncate max-w-[160px] capitalize">
          {title}
        </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCheckIn();
          }}
          className={`px-3 py-1 rounded-xl font-semibold transition-colors border-black cursor-pointer ${
            checked
              ? "bg-white text-blak hover:bg-gray-200"
              : " bg-black text-white"
          }`}
        >
          {checked ? "Completed" : "Complete"}
        </button>
      </div>
    </div>
  );
}
