

export default function PostButton({onClick}:{onClick: () => {}}){
    return (
      <button
        onClick={onClick}
        className="rounded-xl bg-black text-white w-28 h-12 flex items-center justify-center shadow-lg text-l hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
        aria-label="Neuen Post erstellen"
      >
        New Post
      </button>
    );
}