import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import {HabitList} from "./pages/HabitList";
import UserPage from "./pages/UserPage";
import { Statistics } from "./pages/Statistics";
import { Community } from "./pages/Community";
import AppNotInstalled from "./components/AppNotInstalled";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"habits" | "user">("habits");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const isStartetAsApp = window.matchMedia('(display-mode: standalone)').matches;

  /*
  if((isMobile || true) && !isStartetAsApp) {
    return (
      <AppNotInstalled />

    );
  }*/

  if (loading) return <div className="p-6 text-center">Lade...</div>;

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return currentView === "habits" ? (
    <HabitList />
    /*<Statistics />*/
    /*<Community />*/
  ) : (
    <UserPage onBack={() => setCurrentView("habits")} />

  );
}
