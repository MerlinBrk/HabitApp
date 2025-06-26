

export default function AddButton({onClick}:{onClick: () => {}}){
    return (
        <button
            onClick={onClick}
            className="bg-black text-white font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-2xl border-2 hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="Neue Community hinzufügen"
          >
            + 
          </button>
    );
}