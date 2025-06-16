import {useEffect, useState} from "react";
import {supabase} from "./lib/supabase";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Login from "./pages/Login";
import {HabitList} from "./pages/HabitList";
import UserPage from "./pages/UserPage";
import {Statistics} from "./pages/Statistics";
import {Community} from "./pages/Community";
import AppNotInstalled from "./components/AppNotInstalled";

import Layout from "./responsive/Layout.tsx";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<"habits" | "user">("habits");

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

    if (loading) return <div className="p-6 text-center">Lade...</div>;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 469);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);


    const isStartetAsApp = window.matchMedia('(display-mode: standalone)').matches;

    if ((isMobile || true) && !isStartetAsApp) {
        return (
            <AppNotInstalled/>

        );
    }

    if (loading) return <div className="p-6 text-center">Lade...</div>;
    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)}/>;
    return (
        <Router>
            <Layout>
                <div className="ml-64 p-6">
                    <Routes>
                        <Route path="/" element={<HabitList/>}/>
                        <Route path="/stats" element={<Statistics/>}/>
                        <Route path="/community" element={<Community/>}/>
                        <Route path="/profile" element={<UserPage/>}/>
                    </Routes>
                </div>
            </Layout>
        </Router>
    );
}
