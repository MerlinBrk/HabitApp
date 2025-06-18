import React from "react";

interface DropDownButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export default function DropDownButton({
  onClick,
  isActive,
}: DropDownButtonProps) {
  return (
    <button
      className="flex items-center gap-2 text-sm bg-white text-black border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-100 focus:outline-none"
      onClick={onClick}
      type="button"
    >
      {isActive ? "▼" : "►"} Other Habits
    </button>
  );
}
