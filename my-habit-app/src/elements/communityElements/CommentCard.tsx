import { type CommunityComments } from "../../utils/types";
import { useState, useEffect } from "react";
import { getUsernameById ,getProfileImageUrl} from "../../services/profileServices";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface CommentCardProps {
  comment: CommunityComments;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  dayjs.extend(relativeTime);

  const fetchUsername = async () => {
    if (comment) {
      const data = await getUsernameById(comment.user_id);
      setUsername(data);
    }
  };

  const fetchProfileImage = async (userId: string) => {
    if (!userId) return;
    const data = await getProfileImageUrl(userId);
    if (data) {
      setProfileImageUrl(data);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUsername();
    fetchProfileImage(comment.user_id);
    setIsLoading(false);
  }, []);

  if (!isLoading) {
    return (
      <div className="bg-white rounded-xl relative" >
        <div className="flex items-start mb-2 mt-0">
          
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile Image"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {username
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            )}
            
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <div className="text-gray-800 font-medium mr-2">{username}</div>
              <div className="text-gray-400 text-xs">
                {dayjs(comment.created_at).fromNow()}
              </div>
            </div>
            <p className="text-gray-700">{comment.message}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-4" />
      </div>
    );
  }
}
