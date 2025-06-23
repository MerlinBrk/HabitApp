import useIsMobile from "./useIsMobile";
import SideBar from "../elements/SideBar";
import MobileNavBar from "../elements/MobileNavBar";

export default function Layout({children}) {
    const isMobile = useIsMobile();

    return (
        <div className="flex bg-white h-screen">
            {!isMobile && <SideBar/>}
            <div className="flex-1 flex flex-col overflow-hidden">
                {isMobile && <MobileNavBar/>}
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
