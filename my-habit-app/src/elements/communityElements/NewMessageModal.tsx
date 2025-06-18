// components/Calendar.tsx
import React from "react";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { type Habit } from "../../lib/db";
import { getHabits } from "../../services/dexieServices";
import { useUserId } from "../../services/useUserId";
import { USER_ID } from "../../utils/constants";
import {type Community} from "../../utils/types";

interface NewMessageModalProps {
  isActive: boolean;
  currentCommunityId:string;
  onClose: () => void;
  communities: Community;
  onAddButton: (communityId: string, title: string, description: string,habitId:string) => void;
}

export default function NewMessageModal({
  isActive,
  currentCommunityId,
  onClose,
  communities,
  onAddButton,
}: NewMessageModalProps) {

  const [habits, setHabits] = useState<Habit[]>([]);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [choosenHabitId, setChoosenHabitId] = useState<string>("");
  const [isAlreadyTaken, setIsAlreadyTaken] = useState(false);
  const [noInput, setNoInput] = useState(false);
  const [choosenCommunityId, setChoosenCommunityId] = useState<string>(currentCommunityId);

  useEffect(() => {
    loadPublicUserHabits();
  }, [isActive]);

  const loadPublicUserHabits = async () => {
    const data = await getHabits(USER_ID);
    setHabits(data);
  };

  const handleAddCommunity = async () => {
      onAddButton(choosenCommunityId,messageTitle, messageContent,choosenHabitId);
      handleClose();
    
  };

  const handleClose = () => {
    setMessageTitle("");
    setMessageContent("");
    setChoosenHabitId("");
    setChoosenCommunityId("");
    onClose();
  };

  if (!isActive) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative p-6 bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Schließen-Kreuz */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-3 flex bg-white items-center justify-center  hover:border-white text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
          aria-label="Kalender schließen"
        >
          <FaTimes size={12} />
        </button>

        <div className="mb-6 my-8 ounded-xl p-4 ">
          <h1>Neue Nachricht senden</h1><div className="relative">
              <select
                id="community-select"
                value={choosenCommunityId}
                onChange={(e) => setChoosenCommunityId(e.target.value)}
                className="w-full border border-gray-300 bg-white text-base px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="">Bitte eine Community wählen</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.title}
                  </option>
                ))}
              </select>
            </div>
          <input
            type="text"
            value={messageTitle}
            onChange={(e) => {
              setMessageTitle(e.target.value);
              
            }}
            placeholder="Titel der Community"
            className="w-full border border-black bg-white text-base placeholder-gray-400 px-4 py-2 rounded-xl mb-2 focus:outline-none"
          />
          <textarea
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
             
            }}
            placeholder="Beschreibung der Community"
            className="border border-black w-full bg-white text-base placeholder-gray-400 px-4 py-2 rounded-xl mb-2 focus:outline-none min-h-[80px] resize-none"
          />
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="habit-select"
            >
              Gewohnheit auswählen
            </label>
            <div className="relative">
              <select
                id="habit-select"
                value={choosenHabitId}
                onChange={(e) => setChoosenHabitId(e.target.value)}
                className="w-full border border-gray-300 bg-white text-base px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="">Bitte eine Gewohnheit wählen</option>
                {habits.map((habit) => (
                  <option key={habit.id} value={habit.id}>
                    {habit.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {noInput && (
          <p className="text-red-600 text-sm mb-2">
            Bitte beide Felder ausfüllen.
          </p>
        )}
        <div className="my-4" />
        <button
          onClick={handleAddCommunity}
          className="w-full bg-primary text-white py-2 rounded-xl font-semibold bg-purple-700 hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Hinzufügen
        </button>
      </div>
    </div>
  );
}
