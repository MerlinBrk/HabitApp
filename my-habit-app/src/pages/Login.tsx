import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { clearHabitDB, clearHabitLogsDB } from "../services/dexieServices";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const clearDB = async () => {
      await clearHabitDB();
      await clearHabitLogsDB();
    };

    clearDB();
  }, []);

  const handleAuth = async () => {
    setError("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
        return;
      }
    } else {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (user) {
        await supabase.from("Profiles").upsert({
          id: user.id,
          username: name,
        });
      }
    }

    if (error) setError(error);
    else {
      onLogin();
    }
  };

  return (
    <div className="overflow-y-auto hide-scrollbar fixed inset-0 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full h-full flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">geiler</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build better habits, track your progress, and connect with a community of like-minded individuals.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <svg /* check icon */ {...svgProps} className="lucide lucide-circle-check-big h-5 w-5 text-green-500">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span className="text-gray-700">Track habits</span>
              </div>
              <div className="flex items-center gap-2">
                <svg /* chart icon */ {...svgProps} className="lucide lucide-bar-chart3 h-5 w-5 text-blue-500">
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
                <span className="text-gray-700">Analyze progress</span>
              </div>
              <div className="flex items-center gap-2">
                <svg /* users icon */ {...svgProps} className="lucide lucide-users h-5 w-5 text-purple-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-gray-700">Join the community</span>
              </div>
              <div className="flex items-center gap-2">
                <svg /* target icon */ {...svgProps} className="lucide lucide-target h-5 w-5 text-orange-500">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span className="text-gray-700">Achieve goals</span>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center flex-1">
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg {...svgProps} className="lucide lucide-target h-6 w-6 text-blue-600">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personalized Habits</h3>
                    <p className="text-gray-600">
                      Create custom habits, set reminders, and track your daily progress with detailed statistics.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg {...svgProps} className="lucide lucide-users h-6 w-6 text-purple-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Community Hub</h3>
                    <p className="text-gray-600">
                      Share your habits with others, discover new ideas, and motivate each other to succeed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg {...svgProps} className="lucide lucide-bar-chart3 h-6 w-6 text-green-600">
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
                    <p className="text-gray-600">
                      Understand your patterns with comprehensive reports, streak tracking, and personalized insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl mt-10">
              <h1 className="text-2xl font-bold text-center mb-1">Get Started</h1>
              <p className="text-sm text-center text-gray-500 mb-6">
                Sign in or create an account
              </p>
              <div className="flex justify-center mb-6">
                <button
                  aria-label="Switch to login"
                  className={`px-4 py-2 rounded-l-md border ${
                    isLogin ? "bg-gray-100 font-semibold" : "bg-white"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
                <button
                  aria-label="Switch to registration"
                  className={`px-4 py-2 rounded-r-md border ${
                    !isLogin ? "bg-gray-100 font-semibold" : "bg-white"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
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
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  aria-label="Submit authentication"
                  onClick={handleAuth}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                >
                  {isLogin ? "Sign In" : "Register"} →
                </button>
                {isLogin && (
                  <div className="text-center text-sm mt-1">
                    <a href="#" className="text-blue-500 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
