
interface CommentModalProps{
    isActive:boolean;
    handleCommentModalClose:() => {};
}

export default function CommentModal({isActive,handleCommentModalClose}:CommentModalProps){
    return(
        <>
    {isActive && (
        <>
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40"></div>
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-40">
        <div className="relative bg-white rounded-lg p-6 min-w-[320px] min-h-[180px] shadow-lg">
            <button
                className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
                onClick={handleCommentModalClose
                    // Hier später eine Close-Funktion einfügen
                }
            >x
            </button>
            {/* Modal-Inhalt */}
        </div>
    </div> 
    </>
    )
    }
    </>
    );
}