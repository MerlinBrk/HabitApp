import React, { useState } from "react";

type Tab = "All Habits" | "Daily" | "Weekly" | "Monthly";
const tabs: Tab[] = ["All Habits", "Daily", "Weekly", "Monthly"];

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Habits");
  return (
    <div className="bg-white p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Habit Management</h1>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-bold">
            + Create New Habit
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              placeholder="Suche nach einem Habit..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            ></input>
          </div>
        </div>
        <div>
          <div className="inline-flex rounded-full bg-[#f4f6f9] p-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors font-sans ${
                  activeTab === tab
                    ? "bg-white text-black font-bold hover:border-white"
                    : "text-gray-500 bg-[#f4f6f9] hover:text-black hover:bg-white hover:border-white"
                }`}
                style={{
                  ...(activeTab === tab ? { fontWeight: 700 } : {}),
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4"></div>
        </div>
      </div>
    </div>
  );
}
