import {useEffect, useState} from "react";
import {supabase} from "./lib/supabase";
import Login from "./components/Login";
import {HabitList} from "./components/HabitList";
import UserPage from "./components/UserPage";
import Layout from "./responsive/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router";

export default function App() {
    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<"habits" | "user">("habits");

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
            <div className={"App"}>
                <Routes>
                    <Route path={"/"} element={<HabitList onNavigateToUser={() => setCurrentView("user")}/>} />
                </Routes>
            </div>
        </Router>

    );
}
