import {useEffect, useState} from "react";
import {supabase} from "./lib/supabase";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Login from "./pages/Login";
import HabitList from "./pages/HabitList";
import ProfilePage from "./pages/ProfilePage";
import ProgressPage from "./pages/ProgressPage";
import Community from "./pages/Community";
import AppNotInstalled from "./components/AppNotInstalled";

import Layout from "./responsive/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import useIsMobile from "./responsive/useIsMobile.ts"
import ManagementPage from "./pages/ManagementPage.tsx";

export default function App() {
    const isMobile = useIsMobile();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

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
    /*
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


         */
    /*
    if ((isMobile || true) && !isStartetAsApp) {
        return (
            <AppNotInstalled/>

        );
    }
     */

    if (loading) return <div className="p-6 text-center">Lade...</div>;
    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)}/>;
    return (
        <Router>
            <Layout>
                <div className={isMobile ? "" : "ml-64"}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/habits" element={<HabitList/>}/>
                        <Route path="/management" element={<ManagementPage/>}/>
                        <Route path="/stats" element={<ProgressPage/>}/>
                        <Route path="/community" element={<Community/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                    </Routes>
                </div>
            </Layout>
        </Router>
    );
}
