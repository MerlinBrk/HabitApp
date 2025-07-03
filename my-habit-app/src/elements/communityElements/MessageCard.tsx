import React, { useEffect, useState } from "react";
import { type Habit } from "../../lib/db";
import { getHabitById } from "../../services/dexieServices";
import CommentModal from "./CommentModal";
import { getUsernameById ,getProfileImageUrl} from "../../services/profileServices";

interface MessageCardProps {
  userId: string;
  communityName: string;
  title: string;
  message: string;
  habit: string;
  handleCopyHabit: (title: string, days: string[]) => {};
  handleCommentOpen:() =>{};
}

export default function MessageCard({
  userId,
  communityName,
  title,
  message,
  habit,
  handleCopyHabit,
  handleCommentOpen,
}: MessageCardProps) {
  const [currentHabitName, setCurrentHabitName] = useState("");
  const [curHabit, setCurHabit] = useState<Habit>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const fetchHabit = async () => {
    const data = await getHabitById(habit);
    if (data && data.title) {
      setCurrentHabitName(data.title);
      setCurHabit(data);
    } else {
      setCurrentHabitName("Unknown Habit");
    }
  };

  const fetchProfileImage = async () => {
    if (!userId) return;
    const data = await getProfileImageUrl(userId);
    if (data) {
      setProfileImageUrl(data);
    } else {
      console.error("Fehler beim Abrufen des Profilbilds");
    }
  }

  const fetchUserName = async () => {
    const data = await getUsernameById(userId);
    setUsername(data);
  }
  useEffect(() => {
    if (habit != null && habit !== "") {
      fetchHabit();
    }
    fetchUserName();
    fetchProfileImage();
  }, []);

  const handleCopy = () => {
    if (curHabit) {
      handleCopyHabit(curHabit.title, curHabit.days);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };
  
  const handleCommentClick = () => {
    handleCommentOpen();
  };

  return (
    <div className="bg-white border shadow rounded-xl p-4 mb-4 relative">
        
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg animate-fade-in-out">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22c55e" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Erfolgreich kopiert!</span>
          </div>
        </div>
      )}
      <div className="flex items-center mb-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            profileImageUrl ? "" : "bg-blue-500"
          }`}
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profilbild"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-lg">
              {username
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
            </span>
          )}
        </div>
        <div className="text-gray-800 font-semibold">{username}</div>
      </div>
      <div className="flex items-start justify-between mt-2">
        <div className="flex-1">
          <p className="text-xl font-bold mb-1">{title}</p>
          <p className="text-gray-700">{message}</p>
          <div className="text-sm text-gray-500 mt-2">
            Community: {communityName}
          </div>
        </div>
        <button
          onClick={handleCommentClick}
          className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow transition-colors ml-4"
          title="Kommentieren"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
      {curHabit ? (
        <div className="bg-white border shadow rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-black">{currentHabitName}</p>
              <p className="text-sm">{curHabit?.days?.join(" ")}</p>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-xl font-semibold transition-colors border-black cursor-pointer bg-white text-black hover:bg-gray-200"
            >
              Copy Habit
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: scale(0.95);}
                    10% { opacity: 1; transform: scale(1);}
                    90% { opacity: 1; transform: scale(1);}
                    100% { opacity: 0; transform: scale(0.95);}
                }
                .animate-fade-in-out {
                    animation: fade-in-out 1.5s;
                }
            `}</style>
    </div>
  );
}
