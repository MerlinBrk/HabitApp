import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async () => {
    setError("");

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
          },
        });

    if (error) setError(error.message);
    else onLogin();
  };

  return (
    
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Habit Tracker
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Bauen Sie bessere Gewohnheiten auf, verfolgen Sie Ihren
              Fortschritt und verbinden Sie sich mit einer Community von
              Gleichgesinnten.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-check-big h-5 w-5 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-gray-700">Gewohnheiten verfolgen</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bar-chart3 h-5 w-5 text-blue-500 "
                >
                  <path d="M3 3v18h18"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
                <span className="text-gray-700">Fortschritt analysieren</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-users h-5 w-5 text-purple-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="text-gray-700">Community beitreten</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-target h-5 w-5 text-orange-500"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                <span className="text-gray-700">Ziele erreichen</span>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center ">
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-target h-6 w-6 text-blue-600"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Persönliche Gewohnheiten
                    </h3>
                    <p className="text-gray-600">
                      Erstellen Sie individuelle Gewohnheiten, setzen Sie
                      Erinnerungen und verfolgen Sie Ihre täglichen Fortschritte
                      mit detaillierten Statistiken.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-users h-6 w-6 text-purple-600"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Community Hub
                    </h3>
                    <p className="text-gray-600">
                      Teilen Sie Ihre Gewohnheiten mit anderen, entdecken Sie
                      neue Ideen und motivieren Sie sich gegenseitig zum Erfolg.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bar-chart3 h-6 w-6 text-green-600"
                    >
                      <path d="M3 3v18h18"></path>
                      <path d="M18 17V9"></path>
                      <path d="M13 17V5"></path>
                      <path d="M8 17v-3"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Detaillierte Analysen
                    </h3>
                    <p className="text-gray-600">
                      Verstehen Sie Ihre Muster mit umfassenden Berichten,
                      Streak-Tracking und personalisierten Einblicken.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl mt-10">
              <h1 className="text-2xl font-bold text-center mb-1">Loslegen</h1>
              <p className="text-sm text-center text-gray-500 mb-6">
                Melden Sie sich an oder erstellen Sie ein Konto
              </p>

              <div className="flex justify-center mb-6">
                <button
                  className={`px-4 py-2 rounded-l-md border ${
                    isLogin ? "bg-gray-100 font-semibold" : "bg-white"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Anmelden
                </button>
                <button
                  className={`px-4 py-2 rounded-r-md border ${
                    !isLogin ? "bg-gray-100 font-semibold" : "bg-white"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Registrieren
                </button>
              </div>

              <div className="space-y-4">
                {!isLogin && (
                  <input
                    type="username"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <input
                  type="email"
                  placeholder="ihre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleAuth}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                >
                  {isLogin ? "Anmelden" : "Registrieren"} →
                </button>

                {isLogin && (
                  <div className="text-center text-sm mt-1">
                    <a href="#" className="text-blue-500 hover:underline">
                      Passwort vergessen?
                    </a>
                  </div>
                )}
              </div>

              <div className="my-6 border-t pt-4 text-center text-sm text-gray-500">
                Oder probieren Sie es als Demo aus
              </div>

              <button className="w-full border py-2 rounded-md hover:bg-gray-100 transition">
                Demo-Modus starten
              </button>

              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
}
