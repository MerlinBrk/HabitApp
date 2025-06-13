import React from "react";
import { FaTrash} from "react-icons/fa"; // Beispiel für ein Icon (Heart) aus Font Awesome

interface IconButtonProps {
  onClick: () => void;
}

export default function IconButton({onClick}:IconButtonProps){
  return (
    <button
      onClick={onClick}
      className="flex items-center z-10 justify-center text-white p-1 rounded-full hover:bg-opacity-80 transition"
    >
      <FaTrash size={15}  className="primary"/> {/* Hier ist das Icon */}
    </button>
  );
};

