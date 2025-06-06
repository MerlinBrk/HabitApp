

export default function SideBar({  isOpen,
  onClose,
  
}: {
  isOpen: boolean;
  onClose: () => void;
  
}) {
  if (!isOpen) return null;

  return (
    <div className="w-1/4 bg-gray-100 p-6 overflow-auto">
        <button
          onClick={onClose}
          
          aria-label="Seitenleiste schließen"
        >
          &times;
        </button>
       </div>
  
  );
}