

export default function PostButton({onClick}:{onClick: () => {}}){
    return (
        <button
            onClick={onClick}
            className="bg-primary bg-purple-700 text-white w-28 h-12 flex items-center justify-center shadow-lg text-l hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="Neuen Post erstellen"
          >
            New Post
          </button>
    );
}