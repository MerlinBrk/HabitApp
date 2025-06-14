// components/Calendar.tsx
import React from "react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";


interface NewCommunityModalProps {
  currentTitles: string[];
  isActive: boolean;
  onClose: () => void;
  onAddButton: (title:string, description:string) => void;
}

export default function NewCommunityModal({
  currentTitles,
  isActive,
  onClose,
  onAddButton
}: NewCommunityModalProps) {
  const [communityTitle, setCommunityTitle] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [isAlreadyTaken,setIsAlreadyTaken] = useState(false);
  const [noInput,setNoInput] = useState(false);

  const handleAddCommunity = async () => {
    if (
      communityTitle !== "" &&
      communityDescription !== "" 
    ) {
      if(
      !currentTitles.includes(communityTitle.trim())){

      
      onAddButton(communityTitle, communityDescription);
      handleClose();
      }
      else{
        setIsAlreadyTaken(true);
      }
    }
    else{
      setNoInput(true);
    }
    // Optional: else show error if title exists or fields are empty
  };

  const handleClose = () => {
setCommunityDescription("");
    setCommunityTitle("");
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
        
        <div className="mb-6 my-8 ounded-xl p-4">
            <h1>Neue Community</h1>
          <input
            type="text"
            value={communityTitle}
            onChange={(e) => {setCommunityTitle(e.target.value); setIsAlreadyTaken(false); setNoInput(false);}}
            placeholder="Titel der Community"
            className="w-full border border-black bg-white text-base placeholder-gray-400 px-4 py-2 rounded-xl mb-2 focus:outline-none"
          />
          {isAlreadyTaken && (
            <p className="text-red-600 text-sm mb-2">
              Dieser Name wird bereits verwendet.
            </p>
          )}
          <textarea
            value={communityDescription}
            onChange={(e) => {setCommunityDescription(e.target.value);setNoInput(false);}}
            placeholder="Beschreibung der Community"
            className="border border-black w-full bg-white text-base placeholder-gray-400 px-4 py-2 rounded-xl mb-2 focus:outline-none min-h-[80px] resize-none"
          />
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
