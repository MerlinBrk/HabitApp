interface JoinLeaveButtonProps{
    title:string;
    onClick: () => void;
}

export default function JoinLeaveButton({title,onClick}:JoinLeaveButtonProps){
    return(
        <button
                        onClick={onClick}
                        className="rounded-xl bg-black font-bold text-white px-6 py-2 flex items-center justify-center shadow-lg text-l hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                        aria-label={title}
                      >
                        {title}
                      </button>
    );
}