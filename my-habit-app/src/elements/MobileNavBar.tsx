export default function MobileNavBar() {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-2 shadow-inner">
            <ul className="flex justify-around">
                <li>
                    <a
                        href="/"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors text-center"
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a
                        href="/management"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors text-center"
                    >
                        Habit Management
                    </a>
                </li>
                <li>
                    <a
                        href="/community"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors text-center"
                    >
                        Community
                    </a>
                </li>
                <li>
                    <a
                        href="/profile"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors text-center"
                    >
                        Profile
                    </a>
                </li>
            </ul>
        </div>
    );
}
