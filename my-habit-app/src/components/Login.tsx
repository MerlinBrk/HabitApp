import {useState} from "react";
import {supabase} from "../lib/supabase";


export default function Login({onLogin}: { onLogin: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleAuth = async (type: "signIn" | "signUp") => {
        setError("");


        const {error} =
            type === "signIn"
                ? await supabase.auth.signInWithPassword({email, password})
                : await supabase.auth.signUp({email, password});

        if (error) setError(error.message);
        else onLogin(); // z.B. Session laden
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-6 shadow-xl rounded-2xl mt-10">
            <h1 className="text-xl font-bold text-center mb-4">Login / Registrieren</h1>
            <input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded text-white"
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded text-white"
            />
            <button
                onClick={() => handleAuth("signIn")}
                className="w-full bg-blue-600 text-white py-2 rounded mb-2"
            >
                Einloggen
            </button>
            <button
                onClick={() => handleAuth("signUp")}
                className="w-full border py-2 rounded text-white"
            >
                Registrieren
            </button>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
    );
}
