import React, { useState } from "react";
import {type Community} from "../../utils/types"



export default function SearchBar({ data,onClick }: { data: Community[],onClick: (communityId:string) => {} }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Community[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 0) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item: Community) => {
    setInput("");
    setSuggestions([]);
    onClick(item.id);
  };

  return (
    
      <div className="relative">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="🔍 Suche nach einer Community..."
        className="w-full sm:w-[400px] md:w-[500px] lg:w-[600px] text-lg px-4 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-inner border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl mt-2 shadow-xl z-10">
        {suggestions.map((item) => (
          <li
          key={item.id}
          onClick={() => handleSelect(item)}
          className="px-6 py-3 hover:bg-gray-100 transition-colors cursor-pointer text-gray-800"
          >
          {item.title}
          </li>
        ))}
        </ul>
      )}
      </div>
    
  );
}
