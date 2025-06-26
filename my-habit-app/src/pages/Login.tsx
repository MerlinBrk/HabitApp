import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name,setName] = useState("");

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
        {!isLogin &&(
        <input 
          type="username"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />)
}
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

      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
}
