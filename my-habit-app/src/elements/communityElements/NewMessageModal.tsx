
import React from "react";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { type Habit } from "../../lib/db";
import { getHabits } from "../../services/dexieServices";
import { useUserId } from "../../services/useUserId";
import { USER_ID } from "../../utils/constants";
import {type Community} from "../../utils/types";

interface NewMessageModalProps {
  isActive: boolean;
  currentCommunityId:string;
  onClose: () => void;
  communities: Community;
  onAddButton: (communityId: string, title: string, description: string,habitId:string) => void;
}

export default function NewMessageModal({
  isActive,
  currentCommunityId,
  onClose,
  communities,
  onAddButton,
}: NewMessageModalProps) {

  const [habits, setHabits] = useState<Habit[]>([]);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [choosenHabitId, setChoosenHabitId] = useState<string>("");
  const [isAlreadyTaken, setIsAlreadyTaken] = useState(false);
  const [noInput, setNoInput] = useState(false);
  const [choosenCommunityId, setChoosenCommunityId] = useState<string>(currentCommunityId);

  useEffect(() => {
    loadPublicUserHabits();
    setChoosenCommunityId(currentCommunityId);
  }, [isActive]);

  const loadPublicUserHabits = async () => {
    const data = await getHabits(USER_ID);
    setHabits(data);
  };

  const handleAddMessage = async () => {
      onAddButton(choosenCommunityId,messageTitle, messageContent,choosenHabitId);
      handleClose();
    
  };

  const handleClose = () => {
    setMessageTitle("");
    setMessageContent("");
    setChoosenHabitId("");
    setChoosenCommunityId("");
    onClose();
  };

  if (!isActive) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-40"></div>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed bg-white left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out sm:rounded-lg sm:max-w-[500px]"
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Neue Nachricht senden
          </h2>
          <p className="text-sm text-muted-foreground">
            Wähle eine Community und Gewohnheit, gib einen Titel und eine Nachricht ein.
          </p>
        </div>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="community-select" className="text-sm font-medium leading-none">
              Community auswählen
            </label>
            <select
              id="community-select"
              value={choosenCommunityId}
              onChange={(e) => setChoosenCommunityId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none transition-colors appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='16' height='16' fill='none' stroke='%23999' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              <option value="">Bitte eine Community wählen</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Titel der Nachricht
            </label>
            <input
              id="title"
              type="text"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              placeholder="Titel eingeben"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="content" className="text-sm font-medium leading-none">
              Nachricht
            </label>
            <textarea
              id="content"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Nachricht schreiben..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="habit-select" className="text-sm font-medium leading-none">
              Gewohnheit auswählen
            </label>
            <select
              id="habit-select"
              value={choosenHabitId}
              onChange={(e) => setChoosenHabitId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none transition-colors appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='16' height='16' fill='none' stroke='%23999' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              <option value="">
                (Optional)
              </option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Du kannst eine Gewohnheit auswählen, musst aber nicht.
            </p>
          </div>
        </div>

        {noInput && (
          <p className="text-sm text-red-600">Bitte alle Felder ausfüllen.</p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
          aria-label="Abbrechen"
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-bold shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Abbrechen
          </button>
          <button
          aria-label="Nachricht hinzufügen"
            type="button"
            onClick={handleAddMessage}
            className="inline-flex items-center justify-center bg-black font-bold text-white rounded-md px-4 py-2 text-sm  hover:text-black shadow hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </>

  );
}
