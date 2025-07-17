import { FaHome, FaTasks, FaUsers, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const navItems = [
    { href: "/#/", icon: <FaHome size={22} />, label: "Home" },
    { href: "/#/management", icon: <FaTasks size={22} />, label: "Habits" },
    { href: "/#/community", icon: <FaUsers size={22} />, label: "Community" },
    { href: "/#/profile", icon: <FaUser size={22} />, label: "Profile" },
];

export default function MobileNavBar() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
            <ul className="flex justify-around items-center py-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={`flex flex-col items-center px-3 py-1 no-underline transition-colors ${
                                    isActive
                                        ? "text-black"
                                        : "text-gray-500 hover:text-blue-600"
                                }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">{item.label}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
