// components/Calendar.tsx
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FaTimes } from 'react-icons/fa';

export default function Calendar({ isActive,selected, onSelect,onClose }: {
    isActive: boolean;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onClose: () => void;
}) {
    if (!isActive) return null;
  return (
    <div className="relative p-4 bg-white rounded-xl shadow">
      {/* Schließen-Kreuz */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
        aria-label="Kalender schließen"
      >
        <FaTimes size={18} />
      </button>

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}
