import { useStore } from "../lib/store";
import { useEffect } from "react";

export default function SideBar() {
  const list = useStore((state) => state.list);
  const addCommunityName = useStore((state) => state.addCommunityName);

  function handleItemClick(item: string) {
    addCommunityName(item);
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white p-6 shadow-lg overflow-y-auto">
      <ul className="flex flex-col space-y-4">
        <li>
          <a
            href="/"
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-black hover:text-white transition-colors"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/habits"
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Habits
          </a>
        </li>
        <li>
          <a
            href="/progress"
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Progress
          </a>
        </li>
        <li>
          <a
            href="/community"
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Community
          </a>
        </li>
        <li>
          <a
            href="/profile"
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Profile
          </a>
        </li>
        {list.length > 0 && (
          <li>
            <hr className="my-2 border-gray-300" />
          </li>
        )}
        {list.map((item, index) => (
            <li key={index} className="flex items-center space-x-1">
            <a
              href="#"
              onClick={e => {
              e.preventDefault();
              handleItemClick(item);
              }}
              className="flex items-center block px-2 py-1 rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors no-underline flex-1"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 font-bold text-lg mr-2">
              {item.charAt(0).toUpperCase()}
              </div>
              {item}
            </a>
            </li>
        ))}
      </ul>
    </div>
  );
}
