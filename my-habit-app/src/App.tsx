import {useEffect, useState} from "react";
import {supabase} from "./lib/supabase";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Community from "./pages/Community";

import Layout from "./responsive/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import useIsMobile from "./responsive/useIsMobile.ts"
import ManagementPage from "./pages/ManagementPage.tsx";
import {
  getUserIdFromSession,
} from "./lib/auth.ts";

import {
  pullHabitLogsFromSupabase,
  pullHabitsFromSupabase,
} from "./lib/sync.ts";

export default function App() {
    const isMobile = useIsMobile();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setIsLoggedIn(!!session);
            setLoading(false);
        });

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

    return () => subscription.unsubscribe();
  }, []);

   useEffect(() => {
    if (isLoggedIn) {
      fetchUserId();
      setLoading(true);
      
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
        try {

          await pullHabitLogsFromSupabase(userId);
          await pullHabitsFromSupabase(userId);
        } catch (error) {
          console.error("Error pulling data:", error);
        } finally {
          setLoading(false);

        }
      })();
  }, [userId]);

  const fetchUserId = async () => {
    const userID = await getUserIdFromSession();
    setUserId(userID);
  };

  if (loading)
    return (
      <main className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"
            role="status"
            aria-label="Lädt..."
          />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;
  return (
    <Router>
      <Layout>
        <div
          className={
            isMobile
              ? " overflow-auto hide-scrollbar "
              : "ml-64 overflow-auto hide-scrollbar "
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/management" element={<ManagementPage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}
