import { type CommunityComments } from "../../utils/types";
import {useState,useEffect} from "react";
import { getUsernameById } from "../../services/profileServices";

interface CommentCardProps  {
    comment: CommunityComments;
}

export default function CommentCard({comment}:CommentCardProps){
     const [username, setUsername] = useState("");
     const [isLoading,setIsLoading] = useState(true);

     const fetchUsername = async() =>{
        if(comment){
        const data = await getUsernameById(comment.user_id);
        setUsername(data);
        }
     }

     useEffect(()=>{
        setIsLoading(true);
        fetchUsername();
        setIsLoading(false);
     },[])

     if(!isLoading){
    return (<div
                 
                  className="bg-white border shadow rounded-xl p-4 relative"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="text-gray-800 font-medium">
                      {username}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.message}</p>
                </div>);
     }
}