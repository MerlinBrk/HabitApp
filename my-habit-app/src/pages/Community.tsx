import SearchBar from "../elements/communityElements/SearchBar";
import SideBar from "../elements/SideBar";

export function Community() {
  return (
    <div className="flex h-screen w-screen">
      <SideBar isOpen={true} onClose={() => {}} />

      <div className="sm:ml-64 p-4 flex-1 bg-white overflow-auto border-l border-gray-300">
        <div className="w-full h-full bg-white rounded-none shadow-none p-4 relative">
          {/* Statistik-Inhalte kommen hier hin */}
          <div className="text-gray-700 text-lg"></div>
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
