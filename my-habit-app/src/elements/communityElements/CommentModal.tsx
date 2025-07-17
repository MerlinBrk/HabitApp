import { useState, useEffect } from "react";
import { getCommunityMessageById } from "../../services/messageServices";
import {
  type CommunityMessage,
  type CommunityComments,
} from "../../utils/types";
import {
  getUsernameById,
  getProfileImageUrl,
} from "../../services/profileServices";
import {
  addNewCommentToMessage,
  getAllCommentsByMessageId,
} from "../../services/commentsServices";
import NewCommentCard from "./NewCommentCard";
import CommentCard from "./CommentCard";

interface CommentModalProps {
  isActive: boolean;
  message_id: string;
  handleCommentModalClose: () => void;
  userId: string; // Optional userId prop for fetching profile image
}

export default function CommentModal({
  isActive,
  message_id,
  handleCommentModalClose,
  userId,
}: CommentModalProps) {
  const [message, setMessage] = useState<CommunityMessage>();
  const [username, setUsername] = useState("");
  const [comments, setComments] = useState<CommunityComments[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const fetchCommentById = async () => {
    if (message_id !== "") {
      const data = await getCommunityMessageById(message_id);
      setMessage(data);
    }
  };
  const fetchUserName = async (userId: string) => {
    const data = await getUsernameById(userId);
    setUsername(data);
  };

  const fetchComments = async () => {
    const data = await getAllCommentsByMessageId(message_id);
    setComments(data);
  };

  const fetchProfileImage = async (userId: string) => {
    if (!userId) return;
    const data = await getProfileImageUrl(userId);
    if (data) {
      setProfileImageUrl(data);
    } else {
      console.error("Fehler beim Abrufen des Profilbilds");
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchCommentById();
    }
  }, [isActive]);

  useEffect(() => {
    if (message) {
      fetchUserName(message.user_id);
      fetchComments();
      const interval = setInterval(() => {
        fetchComments();
      }, 1000); // jede Sekunde

      return () => clearInterval(interval); // Clean-up beim Unmount

      fetchProfileImage(message.user_id);
    }
  }, [message]);

  const handleCommentSubmit = async (commentText: string) => {
    await addNewCommentToMessage(message_id, userId, commentText);
  };

  if (!isActive) return;
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-40"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-40">
        <div className="relative bg-white rounded-lg p-6 shadow-lg w-[90vw] max-w-[1280px] h-[85vh] overflow-y-auto  hide-scrollbar ">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close comment modal"
            onClick={handleCommentModalClose}
          >
            ×
          </button>
          <h1 className="text-3xl font-bold">Message</h1>
          {/* Message Display */}
          {message && (
            <div className="mt-8 bg-white border shadow rounded-xl p-4 mb-4 relative">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
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
              <div className="mt-2">
                <p className="text-xl font-bold mb-1">{message.title}</p>
                <p className="text-gray-700">{message.message}</p>
              </div>
            </div>
          )}

          {/* Kommentar-Eingabe */}
          <NewCommentCard handleCommentSubmit={handleCommentSubmit} />

          {/* Kommentare anzeigen */}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold mt-8 mb-4">
              Comments {"(" + comments.length + ")"}
            </h2>
            {comments.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-500 text-sm rounded-lg">
                <p className="text-gray-500">No comments yet</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <CommentCard key={index} comment={comment} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
