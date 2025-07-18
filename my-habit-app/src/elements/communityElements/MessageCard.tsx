import { useEffect, useState } from "react";
import { type Habit } from "../../lib/db";
import {
  getUsernameById,
  getProfileImageUrl,
} from "../../services/profileServices";
import { getHabitByIdFromSupabase } from "../../services/habitServices";
import { getAllCommentsByMessageId } from "../../services/commentsServices";
import {supabase} from "../../lib/supabase";

interface MessageCardProps {
  messageId: string;
  userId: string;
  communityName: string;
  title: string;
  message: string;
  habit: string;
  handleCopyHabit: (title: string, description: string, days: string[]) => void;
  handleCommentOpen: () => void;
}

export default function MessageCard({
  messageId,
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
  const [commentAmount, setCommentAmount] = useState(0);

  const fetchHabit = async () => {
    const data = await getHabitByIdFromSupabase(habit);
    if (data && data.title) {
      setCurrentHabitName(data.title);
      setCurHabit(data);
    } else {
      setCurrentHabitName("");
    }
  };

  const fetchCommentAmount = async () => {
    const data = await getAllCommentsByMessageId(messageId);
    setCommentAmount(data.length);
  };

  const fetchProfileImage = async () => {
    if (!userId) return;
    const data = await getProfileImageUrl(userId);
    if (data) {
      setProfileImageUrl(data);
    }
  };

  const fetchUserName = async () => {
    const data = await getUsernameById(userId);
    setUsername(data);
  };
  useEffect(() => {
  if (habit != null && habit !== "") {
    fetchHabit();
  }

  fetchUserName();
  fetchProfileImage();
  fetchCommentAmount(); // Initial laden

  const channel = supabase
    .channel(`realtime-comments-${messageId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Community_comments',
        filter: `message_id=eq.${messageId}`,
      },
      () => {
        setCommentAmount((prev) => prev + 1);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const handleCopy = () => {
    if (curHabit) {
      handleCopyHabit(
        curHabit.title,
        curHabit.description,
        curHabit.days ?? []
      );
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
            <span>Successfully Copied</span>
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
              alt="Profile Image"
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
        <div
          onClick={() => alert(`Profile for ${username}`)}
          role="button"
          className="text-gray-800 font-semibold"
        >
          {username}
        </div>
      </div>
      <div className="flex items-start justify-between mt-2">
        <div className="flex-1">
          <p className="text-xl font-bold mb-1">{title}</p>
          <p className="text-gray-700 break-words max-w-full">{message}</p>
          <div className="text-sm text-gray-500 mt-2">
            Community: {communityName}
          </div>
        </div>
        <button
          aria-label="Open comments"
          onClick={handleCommentClick}
          className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 shadow transition-colors ml-4 flex items-center gap-2 min-w-[56px]"
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
          <span className="text-gray-700 text-sm font-bold">
            {commentAmount}
          </span>
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
              aris-label="Copy habit"
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
