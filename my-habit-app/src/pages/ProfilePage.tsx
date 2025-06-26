import { supabase } from "../lib/supabase";
import React from "react";
import { useUserName,useUserEmail } from "../services/useUserId";

export default function ProfilePage({ onBack }: { onBack: () => void }) {
  const USERNAME = useUserName();
  const USEREMAIL = useUserEmail();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Optional: erzwingt Neu-Login
  };

  return (
    <main className="flex-1 w-full p-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold">{USERNAME}</h2>
            <p className="text-muted-foreground">{USEREMAIL}</p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              <div className="rounded-xl border bg-card text-card-foreground shadow p-4 text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Habits</p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-4 text-center">
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-4 text-center">
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              </div>
              <button onClick={handleLogout}className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full max-w-md">Edit Profile</button>
            
          </div>
        </div>
      </div>
    </main>
  );
}
