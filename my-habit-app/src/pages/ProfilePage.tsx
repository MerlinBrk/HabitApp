import { supabase } from "../lib/supabase";
import React, { useState, useEffect } from "react";
import { USER_ID } from "../utils/constants";
import { getUserEmailFromSession, getUserIdFromSession ,getUsernameBySession} from "../lib/auth";
import {
  clearHabitDB,
  clearHabitLogsDB,
  getHabits,
  getPercentageDoneByUserId,
  getUserStreak,
} from "../services/dexieServices";
import {
  getProfileImageUrl,
  uploadProfileImage,
  getUserEmailById,
} from "../services/profileServices";

export default function ProfilePage() {
  const [userStreak, setUserStreak] = useState(0);
  const [userPercentage, setUserPercentage] = useState(0);
  const [userHabitAmount, setUserHabitAmount] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await clearHabitDB();
    await clearHabitLogsDB();
    await supabase.auth.signOut();
    localStorage.clear();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadProfileImage(USER_ID, file);
      setProfileImageUrl(imageUrl);
    } catch (error: any) {
      console.error("Fehler beim Hochladen des Profilbilds:", error.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      const id = await getUserIdFromSession(); // NEU
      if (!id) return;
      fetchAllData(id);
    };

    load();
  }, []);

  const fetchUserEmail = async () => {
    const email = await getUserEmailFromSession();
    setUserEmail(email);
  };

  const fetchUserName = async () => {
    const name = await getUsernameBySession();
    setUserName(name);
  };
  const fetchAllData = async (id: string) => {
  try {
    await Promise.all([
      fetchUserEmail(),
      fetchUserName(),
      fetchStreak(id),
      fetchUserDonePercentage(id),
      fetchUserHabitAmount(id),
      fetchProfileImage(id),
    ]);
  } catch (error) {
    console.error("Fehler beim Laden der Profildaten:", error);
  } finally {
    setLoading(false);
  }
};

  const fetchStreak = async (id: string) => {
    const data = await getUserStreak(id);
    setUserStreak(data);
  };

  const fetchUserDonePercentage = async (id: string) => {
    const data = await getPercentageDoneByUserId(id);
    setUserPercentage(data);
  };

  const fetchUserHabitAmount = async (id: string) => {
    const data = await getHabits(id);
    setUserHabitAmount(data.length);
  };

  const fetchProfileImage = async (id: string) => {
    if (!id) return;
    const data = await getProfileImageUrl(id);
    if (data) {
      setProfileImageUrl(data);
    } else {
      console.error("Fehler beim Abrufen des Profilbilds");
    }
  };
if (loading) {
  return (
    <main className="flex-1 w-full p-4 flex items-center justify-center">
      <div className="text-center">
        <div
          className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"
          role="status"
          aria-label="Lädt..."
        />
        <p className="text-sm text-muted-foreground">Profil wird geladen...</p>
      </div>
    </main>
  );
}

  return (
    <main className="flex-1 w-full p-4">
      <div className="flex flex-col space-y-1.5 pt-6 pb-6">
        <h1 className="text-3xl font-bold tracking-tight ">Profile</h1>
      </div>
      <div className="p-6 pt-0">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="relative">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profilbild"
                  className="w-24 h-24 rounded-full object-cover border shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-4xl font-bold border shadow">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              )}

              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2L9 17H5v-4l6-6z"
                  />
                </svg>
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center">{userName}</h2>
          <p className="text-muted-foreground text-center break-all">
            {userEmail}
          </p>

          {/* Responsive grid: 1 column on mobile, 3 columns on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-4 text-center">
              <p className="text-2xl font-bold">{userHabitAmount}</p>
              <p className="text-sm text-muted-foreground">Active Habits</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-4 text-center">
              <p className="text-2xl font-bold">{userPercentage}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-4 text-center">
              <p className="text-2xl font-bold">{userStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>

          <button
            aria-label="Logout"
            onClick={handleLogout}
            className="inline-flex items-center justify-center bg-black text-white font-bold hover:bg-white border-2 border-black hover:text-black whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full max-w-md mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
