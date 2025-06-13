import { FaCheck } from "react-icons/fa";
import IconButton from "../IconButton"; // falls du eine eigene Komponente hast
import React from "react";



interface Props{
  title: string;
  checked: boolean;
  handleCalenderOpenClick: () => void;
  handleDeleteClick: () => void;
  toggleCheckIn: () => void;
};

export default function SmallHabitCard({
  habit,
  title,
  checked,
  handleCalenderOpenClick,
  handleDeleteClick,
  toggleCheckIn,
}: Props) {
  return (
    <div
      className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition transform cursor-pointer"
      onClick={handleCalenderOpenClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
          {title.charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-900 font-medium text-sm truncate max-w-[160px]">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
        />
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleCheckIn();
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
            checked
              ? "bg-green-500 border-green-500 text-white"
              : "bg-gray-300 border-gray-300 hover:bg-gray-400 text-transparent"
          }`}
        >
          {checked && <FaCheck size={12} />}
        </div>
      </div>
    </div>
  );
}
