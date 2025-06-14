import React, { useState } from "react";


export default function SearchBar({data}:{data: string[]}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 0) {
      const filtered = data.filter((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    setInput(item);
    setSuggestions([]);
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="🔍 Suche nach einer Community..."
          className="w-full text-lg px-6 py-3 rounded-full bg-white/70 backdrop-blur-md shadow-inner border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
        {suggestions.length > 0 && (
          <ul className="absolute w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl mt-2 shadow-xl z-10">
            {suggestions.map((item) => (
              <li
                key={item}
                onClick={() => handleSelect(item)}
                className="px-6 py-3 hover:bg-gray-100 transition-colors cursor-pointer text-gray-800"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
