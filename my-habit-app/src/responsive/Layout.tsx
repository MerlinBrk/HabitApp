import useIsMobile from "./useIsMobile";
import SideBar from "../elements/SideBar";
import MobileNavBar from "../responsive/MobileNavBar";
import { type ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
    const isMobile = useIsMobile();

    return (
        <div className="flex bg-white h-screen">
            {!isMobile && <SideBar/>}
            <div className="flex-1 flex flex-col overflow-hidden">
                {isMobile && <MobileNavBar/>}
                <main className={`flex-1 ${isMobile ? " overflow-y-auto hide-scrollbar " : " p-4 "}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
