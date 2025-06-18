import React,{useEffect} from 'react';
import {type Habit } from "../../lib/db";

interface MessageCardProps {
  userId: string;
  communityId: string;
  title:string;
  message: string;
  habit:string;
}

export default function MessageCard({ userId,communityId,title,message,habit }: MessageCardProps) {

    return (
        <div className="bg-gray-200 shadow-md rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">
                        {userId
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                    </span>
                </div>
                <div className="text-gray-800 font-semibold">{userId}</div>
            </div>  
            <p className="text-xl font-bold mb-1">{title}</p>
            <p className="text-gray-700">{message}</p>
            <div className="text-sm text-gray-500 mt-2">Community: {communityId}</div>
            <div className="text-sm text-gray-500 mt-2">HabitId: {habit}</div>
            
        </div>
    );
}