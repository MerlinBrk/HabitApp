import React,{ useEffect } from "react";

const COLORS = [
    { name: "Lila", rgb: "139 92 246", hex: "#8b5cf6" },
    { name: "Orange", rgb: "245 158 11", hex: "#f59e0b" },
    { name: "Grün", rgb: "16 185 129", hex: "#10b981" },
    { name: "Rot", rgb: "239 68 68", hex: "#ef4444" },
    { name: "Blau", rgb: "59 130 246", hex: "#3b82f6" },
];

export default function ColorPicker() {
    useEffect(() => {
        const saved = localStorage.getItem("preferredColor");
        if (saved) {
            document.documentElement.style.setProperty("--primary-color", saved);
        }
    }, []);

    const setUserColor = (rgb: string) => {
        document.documentElement.style.setProperty("--primary-color", rgb);
        localStorage.setItem("preferredColor", rgb);
    };

    return (
        <div className="flex gap-3 mt-4">
            {COLORS.map(({ name, rgb, hex }) => (
                <button
                    key={name}
                    aria-label={`Farbe ${name} wählen`}
                    onClick={() => setUserColor(rgb)}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: hex }}
                />
            ))}
        </div>
    );
}
