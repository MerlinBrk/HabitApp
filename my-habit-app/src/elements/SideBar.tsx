export default function SideBar() {
    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-100 p-6 shadow-lg overflow-y-auto">
            <ul className="flex flex-col space-y-4">
                <li>
                    <a
                        href="/"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Habits
                    </a>
                </li>
                <li>
                    <a
                        href="/progress"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Progress
                    </a>
                </li>
                <li>
                    <a
                        href="/community"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Community
                    </a>
                </li>
                <li>
                    <a
                        href="/profile"
                        className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Profile
                    </a>
                </li>
            </ul>
        </div>


    );
}
