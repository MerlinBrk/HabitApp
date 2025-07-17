import {useStore} from "../lib/store";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

export default function SideBar() {
    const list = useStore((state) => state.list);
    const addCommunityName = useStore((state) => state.addCommunityName);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    function handleItemClick(item: string) {
        addCommunityName(item);
    }

    useEffect(() => {
        setIsOpen(false);
    }, [list]);

    function linkClass(path: string) {
        console.log(location.pathname);
        const isActive = location.pathname === path;

        return (
            "block px-4 py-2 rounded-xl text-gray-700 transition-colors " +
            (isActive ? "bg-black text-white" : "hover:bg-black hover:text-white")
        );
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-white p-6 shadow-lg">
            <ul className="flex flex-col space-y-4">
                <li>
                    <a
                        href="/#/"
                        className={
                            linkClass("/#/") + " hover:text-white no-underline font-bold"
                        }
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a
                        href="/#/management"
                        className={
                            linkClass("/#/management") +
                            " hover:text-white no-underline font-bold"
                        }
                    >
                        Habit Management
                    </a>
                </li>
                <li>
                    <a
                        href="/#/community"
                        className={
                            linkClass("/#/community") +
                            " hover:text-white no-underline font-bold"
                        }
                    >
                        Community
                    </a>
                </li>
                <li>
                    <a
                        href="/#/profile"
                        className={
                            linkClass("/#/profile") + " hover:text-white no-underline font-bold"
                        }
                    >
                        Profile
                    </a>
                </li>
                {list.length > 0 && (
                    <li>
                        <hr className="my-2 border-gray-300"/>
                    </li>
                )}
                {(isOpen ? list : list.slice(0, 5)).map((item, index) => (
                    <li key={index} className="flex items-center space-x-1">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick(item.id);
                            }}
                            className="flex items-center block px-2 py-1 rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors no-underline flex-1"
                        >
                            <div
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 font-bold text-lg mr-2">
                                {item.name.charAt(0).toUpperCase()}
                            </div>
                            {item.name}
                        </a>
                    </li>
                ))}

        {list.length > 5 && !isOpen && (
          <li>
            <button
              aria-label="Show more habits"
              className="text-black px-2 py-1"
              onClick={() => setIsOpen(true)}
            >
              Show more...
            </button>
          </li>
        )}
        {list.length > 5 && isOpen && (
          <li>
            <button
              aria-label="Show less habits"
              className="text-black px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Show less
            </button>
          </li>
        )}
      </ul>
    </div>
  );

}
