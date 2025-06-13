import React from "react";
import useIsMobile from "./useIsMobile";
import SideBar from "../elements/SideBar";
import MobileNavBar from "../elements/MobileNavBar";

interface LayoutProps {
    children: React.ReactNode;
    currentView: "habits" | "user";
    setCurrentView: (view: "habits" | "user") => void;
}

export default function Layout({children, currentView, setCurrentView}: LayoutProps) {
    const isMobile = useIsMobile();

    return (
        <div className={"flex h-screen"}>
            {!isMobile && (
                <SideBar currentView={currentView} setCurrentView={setCurrentView}/>
            )}
            <div className={"flex-1 flex flex-col overflow-hidden"}>
                {isMobile && (
                    <MobileNavBar currentView={currentView} setCurrentView={setCurrentView}/>
                )}
                <main className={"flex-1 overflow-auto p-4"}>{children}</main>
            </div>
        </div>
    )
}