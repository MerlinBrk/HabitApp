
import React from "react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";


interface NewCommunityModalProps {
  currentTitles: string[];
  isActive: boolean;
  onClose: () => void;
  onAddButton: (title:string, description:string) => void;
}

export default function NewCommunityModal({
  currentTitles,
  isActive,
  onClose,
  onAddButton
}: NewCommunityModalProps) {
  const [communityTitle, setCommunityTitle] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [isAlreadyTaken,setIsAlreadyTaken] = useState(false);
  const [noInput,setNoInput] = useState(false);

  const handleAddCommunity = async () => {
    if (
      communityTitle !== "" &&
      communityDescription !== "" 
    ) {
      if(
      !currentTitles.includes(communityTitle.trim())){

      
      onAddButton(communityTitle, communityDescription);
      handleClose();
      }
      else{
        setIsAlreadyTaken(true);
      }
    }
    else{
      setNoInput(true);
    }
    // Optional: else show error if title exists or fields are empty
  };

  const handleClose = () => {
setCommunityDescription("");
    setCommunityTitle("");
    onClose();
  };

  if (!isActive) return null;
  return (
    <>
    <div className="fixed inset-0 z-40 bg-black bg-opacity-40"></div>
    <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="create-community-title"
  aria-describedby="create-community-description"
  className="fixed bg-white left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[500px] pointer-events-auto"
>
  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
    <h2
      id="create-community-title"
      className="text-lg font-semibold leading-none tracking-tight"
    >
      Neue Community erstellen
    </h2>
    <p id="create-community-description" className="text-sm text-muted-foreground">
      Gib einen Titel und eine Beschreibung für deine Community ein.
    </p>
  </div>

  <div className="grid gap-4 py-4">
    <div className="grid gap-2">
      <label
        htmlFor="community-title"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Titel der Community
      </label>
      <input
        id="community-title"
        type="text"
        value={communityTitle}
        onChange={(e) => {
          setCommunityTitle(e.target.value);
          setIsAlreadyTaken(false);
          setNoInput(false);
        }}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="z. B. Fitness Fans"
      />
      {isAlreadyTaken && (
        <p className="text-red-600 text-sm">Dieser Name wird bereits verwendet.</p>
      )}
    </div>

    <div className="grid gap-2">
      <label
        htmlFor="community-description"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Beschreibung
      </label>
      <textarea
        id="community-description"
        value={communityDescription}
        onChange={(e) => {
          setCommunityDescription(e.target.value);
          setNoInput(false);
        }}
        placeholder="Worum geht es in dieser Community?"
        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />
    </div>

    {noInput && (
      <p className="text-red-600 text-sm">Bitte beide Felder ausfüllen.</p>
    )}
  </div>

  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
    <button
      type="button"
      onClick={handleClose}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
    >
      Abbrechen
    </button>
    <button
      onClick={handleAddCommunity}
      className="inline-flex bg-black items-center justify-center whitespace-nowrap rounded-md text-sm font-bold hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white shadow hover:bg-primary/90 h-9 px-4 py-2"
    >
      Hinzufügen
    </button>
  </div>
</div>
</>
  );
}
