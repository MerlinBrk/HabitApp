import { supabase } from "../lib/supabase";
import React from "react";

export default function ProfilePage({ onBack }: { onBack: () => void }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Optional: erzwingt Neu-Login
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold">Mein Profil</h1>

        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Zurück
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Abmelden
        </button>
      </div>
    </main>
  );
}
