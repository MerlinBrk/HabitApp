import { useState, useEffect } from "react";
import { getCommunityMessageById } from "../../services/messageServices";
import {
  type CommunityMessage,
  type CommunityComments,
} from "../../utils/types";
import { getUsernameById } from "../../services/profileServices";
import {
  addNewCommentToMessage,
  getAllCommentsByMessageId,
} from "../../services/commentsServices";
import { USER_ID } from "../../utils/constants";
import CommentCard from "./commentCard";
import NewCommentCard from "./NewCommentCard";

interface CommentModalProps {
  isActive: boolean;
  message_id: string;
  handleCommentModalClose: () => {};
}

export default function CommentModal({
  isActive,
  message_id,
  handleCommentModalClose,
}: CommentModalProps) {
  const [message, setMessage] = useState<CommunityMessage>();
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [comments, setComments] = useState<CommunityComments[]>([]);

  const fetchCommunityById = async () => {
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
    const data = await getAllCommentsByMessageId(message.id);
    setComments(data);
    console.log(data);
  };

  const getUserName = async(userId:string) => {
    const data = await getUsernameById(userId);
    return data;
    
  }

  useEffect(() => {
    if (isActive) {
      fetchCommunityById();
    }
  }, [isActive]);

  useEffect(() => {
    if (message) {
      fetchUserName(message.user_id);
      fetchComments();
    }
  }, [message]);

  const handleCommentSubmit = async (commentText:string) => {
    await addNewCommentToMessage(message_id, USER_ID, commentText);
  };
  

  if (!isActive) return;
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-40"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-40">
        <div className="relative bg-white rounded-lg p-6 min-w-[320px] min-h-[180px] shadow-lg w-full max-w-xl">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
            onClick={handleCommentModalClose}
          >
            ×
          </button>

          {/* Message Display */}
          {message && (
            <div className="mt-8 bg-white border shadow rounded-xl p-4 mb-4 relative">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="text-gray-800 font-semibold">{username}</div>
              </div>
              <div className="mt-2">
                <p className="text-xl font-bold mb-1">{message.title}</p>
                <p className="text-gray-700">{message.message}</p>
                <div className="text-sm text-gray-500 mt-2">
                  Community: {message.community_id}
                </div>
              </div>
            </div>
          )}

          {/* Kommentar-Eingabe */}
          <NewCommentCard  handleCommentSubmit={handleCommentSubmit} />

          {/* Kommentare anzeigen */}

          {comments?.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <CommentCard key={index} comment={comment} />
                
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
