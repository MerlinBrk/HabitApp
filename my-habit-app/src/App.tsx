import {useEffect, useState} from "react";
import {supabase} from "./lib/supabase";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Community from "./pages/Community";
import AppNotInstalled from "./components/AppNotInstalled";

import Layout from "./responsive/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import useIsMobile from "./responsive/useIsMobile.ts"
import ManagementPage from "./pages/ManagementPage.tsx";
import {USER_ID} from "./utils/constants.tsx";
import { pullHabitLogsFromSupabase, pullHabitsFromSupabase } from "./lib/sync.ts";

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

    useEffect(()=>{
        const pullData = async() => {
        if(isLoggedIn){
            await pullHabitLogsFromSupabase(USER_ID);
            await pullHabitsFromSupabase(USER_ID);
        }
    }

    pullData();
    },[isLoggedIn]);

    if (loading) return <div className="p-6 text-center">Lade...</div>;
    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)}/>;
    return (
        <Router>
            <Layout>
            <div className={isMobile ? " overflow-auto " : "ml-64 overflow-auto "} >
                <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/management" element={<ManagementPage/>}/>
                <Route path="/community" element={<Community/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                </Routes>
            </div>
            </Layout>
        </Router>
    );
}
