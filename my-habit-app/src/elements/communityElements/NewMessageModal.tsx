import { useState, useEffect } from "react";
import { type Habit } from "../../lib/db";
import { getHabits } from "../../services/dexieServices";
import { type Community } from "../../utils/types";

interface NewMessageModalProps {
  isActive: boolean;
  currentCommunityId: string;
  onClose: () => void;
  communities: Community[];
  onAddButton: (
    communityId: string,
    title: string,
    description: string,
    habitId: string
  ) => void;
  userId: string;
}

export default function NewMessageModal({
  isActive,
  currentCommunityId,
  onClose,
  communities,
  onAddButton,
  userId,
}: NewMessageModalProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [choosenHabitId, setChoosenHabitId] = useState<string>("");

  const [choosenCommunityId, setChoosenCommunityId] =
    useState<string>(currentCommunityId);

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    loadPublicUserHabits();
    setChoosenCommunityId(currentCommunityId);
    setErrorMessage("");
  }, [isActive]);

  const loadPublicUserHabits = async () => {
    const data = await getHabits(userId);
    setHabits(data);
  };

  const handleAddMessage = async () => {
    if (!choosenCommunityId) {
      setErrorMessage("Please select a community.");
      return;
    }
    if (!messageTitle.trim()) {
      setErrorMessage("Please enter a message title.");
      return;
    }

    setErrorMessage("");
    onAddButton(
      choosenCommunityId,
      messageTitle,
      messageContent,
      choosenHabitId
    );
    handleClose();
  };

  const handleClose = () => {
    setMessageTitle("");
    setMessageContent("");
    setChoosenHabitId("");
    setChoosenCommunityId("");
    setErrorMessage("");
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
            Send New Message
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a community and habit, enter a title and message.{" "}
          </p>
        </div>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label
              htmlFor="community-select"
              className="text-sm font-medium leading-none"
            >
              Select Community <span className="text-red-500">*</span>
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
              <option value="">Please choose a community</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Message Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              placeholder="Enter message title..."
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="content"
              className="text-sm font-medium leading-none"
            >
              Message
            </label>
            <textarea
              id="content"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Write a message..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="habit-select"
              className="text-sm font-medium leading-none"
            >
              Select Habit
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
              <option value="">(Optional)</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              You can choose a habit, but you don't have to.
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 font-semibold mt-1">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
            aria-label="Cancel"
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-bold shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            aria-label="Add Message"
            type="button"
            onClick={handleAddMessage}
            className="inline-flex items-center justify-center bg-black font-bold text-white rounded-md px-4 py-2 text-sm  hover:text-black shadow hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
