import {useState} from "react";


interface NewCommentCardProps{
    handleCommentSubmit: (commentText:string) =>{};
}


export default function NewCommentCard({handleCommentSubmit}:NewCommentCardProps){

    const [commentText, setCommentText] = useState("");
    const [isFocused,setIsFocused] = useState(false);

    const handleSubmit = () => {
        if(commentText.trim() !== ""){
        handleCommentSubmit(commentText);
        setCommentText("");
        setIsFocused(false);
        }
    }
    const handleCancel = () =>{
        setCommentText("");
        setIsFocused(false);
    }

    return(<div className="relative border border-gray-400 rounded-3xl p-4 bg-white">
            <textarea
              onFocus={() => setIsFocused(true)}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Aa"
              rows={3}
              className="w-full border-none focus:outline-none text-gray-800 bg-transparent placeholder:text-gray-500"
            />

            {isFocused && (
              <div className="flex justify-end mt-3 space-x-2">
                <button
                  onClick={handleCancel}
                  className="bg-gray-100 text-black px-4 py-2 rounded-full hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900"
                >
                  Comment
                </button>
              </div>
            )}
          </div>);
}