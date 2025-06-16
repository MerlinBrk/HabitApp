
import React, { useState } from "react";

// Beispiel-Daten: Anzahl der Aktionen pro Tag (Datum: Count)
const generateRandomData = (startDate, daysCount) => {
  const data = {};
  const date = new Date(startDate);
  for (let i = 0; i < daysCount; i++) {
    const dayStr = date.toISOString().slice(0, 10);
    // Zufällige Anzahl Aktionen 0–4
    data[dayStr] = Math.floor(Math.random() * 3);
    date.setDate(date.getDate() + 1);
  }
  return data;
};

// Farben ähnlich GitHub Contribution Colors (für 0–4 Aktionen)
const colors = ["#ebedf0","#ffee80","#239a3b"];

// Hilfsfunktionen
const getColor = (count) => {
  if (count == null) return colors[0];
  if (count >= colors.length) return colors[colors.length - 1];
  return colors[count];
};

// Gibt das Datum der vorherigen Sonntage zurück (GitHub Kalender fängt bei Sonntag an)
const getStartSunday = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sonntag der aktuellen Woche
  return d;
};

// Komponente für einen Tag (kleines Quadrat)
const Day = ({ date, count }) => {
  return (
    <div
      title={`${date} — ${count} contribution${count === 1 ? "" : "s"}`}
      style={{
        width: 14,
        height: 14,
        backgroundColor: getColor(count),
        margin: 2,
        borderRadius: 3,
      }}
    />
  );
};

const ContributionCalendar = ({ data, startDate, weeks }) => {
  // Wir bauen ein Array von Wochen (Spalten), jede Woche hat 7 Tage (Zeilen)
  // Startdatum ist der erste Sonntag, damit die Woche richtig beginnt
  const startSunday = getStartSunday(startDate);
  const totalDays = weeks * 7;

  // Für jede Woche (Spalte) ein Array von 7 Tage-Daten
  const calendar = [];

  for (let week = 0; week < weeks; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startSunday);
      currentDate.setDate(startSunday.getDate() + week * 7 + day);
      const dayStr = currentDate.toISOString().slice(0, 10);
      days.push({ date: dayStr, count: data[dayStr] || 0 });
    }
    calendar.push(days);
  }

  return (
    <div style={{ display: "flex" }}>
      {calendar.map((week, wi) => (
        <div key={wi} style={{ display: "flex", flexDirection: "column" }}>
          {week.map((day, di) => (
            <Day key={di} date={day.date} count={day.count} />
          ))}
        </div>
      ))}
    </div>
  );
};




export function ProgressPage() {
   const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // vor 1 Jahr
  const weeks = 53; // ca. 1 Jahr in Wochen
  const data = generateRandomData(startDate, weeks * 7);
  return (
    <div className="flex h-screen w-screen">
      <div className="p-4 sm:ml-64 flex-1 bg-white p-6 overflow-auto border-l border-gray-300">
        <div className="w-full h-full bg-white rounded-none shadow-none p-6 relative">
          
          <div className="text-gray-700 text-lg">Statistik-Seite</div>
         <ContributionCalendar data={data} startDate={startDate} weeks={weeks} />
        </div>
      </div>
    </div>
  );
}
