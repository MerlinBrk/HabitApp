import React from 'react';
import { useUserName } from '../services/useUserId';

export default function HomePage(){
  const userName = useUserName();
    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to HabitHub, {userName}!</h1>
        <p className="text-gray-600 mt-1">Goal Tracker</p>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Your Achievements</h2>
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Monitor Progress */}
      <div className="bg-gray-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm w-full max-w-md mb-6">
  <div className="flex items-center space-x-3">
    
    <div>
      <h3 className="text-base font-semibold text-gray-900">Monitor your Progress</h3>
      <p className="text-sm text-gray-500">Stay on Track with your goals!</p>
    </div>
  </div>
<a
    href="/progress"
    className="bg-black text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-800 transition flex items-center justify-center no-underline"
>
    Track Now
</a>
</div>
      {/* Today's Progress */}
      <div className="bg-gray-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm w-full max-w-md mb-6">
  <div className="flex items-center space-x-3">
    
    <div>
      <h3 className="text-base font-semibold text-gray-900">Fitness Goals</h3>
      <p className="text-sm text-gray-500">Exercise Daily</p>
    </div>
  </div>
  <a
    href="/progress"
    className="bg-black text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-800 transition flex items-center justify-center no-underline"
>
    Join Now
</a>
</div>


      {/* Activities */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Activities</h2>
        <div className="flex gap-4">
          {["Workout", "Meditation", "Reading", "Habit Check"].map((label, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-gray-200 px-4 py-2 rounded-full text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="md:absolute top-6 right-6 md:w-64">
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Daily Habits</h3>
          <p className="text-sm text-gray-600">Log your habits daily!</p>
          <button className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Get Started
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Community Leaderboard</h3>
          {[
            { name: "Alex", pts: 500 },
            { name: "Jamie", pts: 450 },
            { name: "Taylor", pts: 400 },
            { name: "You", pts: 300, rank: "#07" },
          ].map((user, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span>
                #{user.rank || `0${i + 1}`} {user.name}
              </span>
              <span>{user.pts} pts.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
};

