import {useEffect, useState} from "react";
import {supabase} from "./lib/supabase";
import Login from "./components/Login";
import {HabitList} from "./components/HabitList";
import ProfilePage from "./components/ProfilePage.tsx";
import SideBar from "./elements/SideBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import TestPage from "./components/TestPage.tsx";
import Layout from "./responsive/Layout.tsx";

export default function App() {
    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const [loading, setLoading] = useState(true);
    //const [currentView, setCurrentView] = useState<"habits" | "user">("habits");

    /*
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

    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)}/>;
*/
    return (
        <Router>
            <Layout>
                <div className="ml-64 p-6">
                    <Routes>
                        <Route path="/" element={<HabitList/>}/>
                        <Route path="/test" element={<TestPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                    </Routes>
                </div>
            </Layout>
        </Router>
    );
}
