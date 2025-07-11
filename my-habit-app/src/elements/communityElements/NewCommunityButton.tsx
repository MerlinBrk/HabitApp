export default function NewCommunityButton({onClick}:{onClick: () => {}}){
    return (
      <button
        onClick={onClick}
        className="rounded-xl bg-black font-bold text-white h-12 flex items-center justify-center shadow-lg text-l hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
        aria-label="Neue Community erstellen"
      >
        New Community
      </button>
    );
}