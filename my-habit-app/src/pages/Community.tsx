import SearchBar from "../elements/communityElements/SearchBar";
import React, { useEffect, useState } from "react";
import {
  getAllCommunities,
  addNewCommunity,
  getCommunityIdByCommunityTitle,
} from "../services/communityServices";
import {
  getAllCommunityMessages,
  getAllCommunityMessagesByCommunityId,
} from "../services/messageServices";
import { supabase } from "../lib/supabase";
import MessageCard from "../elements/communityElements/MessageCard";
import NewCommunityModal from "../elements/communityElements/NewCommunityModal";
import AddButton from "../elements/AddButton";
import { type Community, type CommunityMessage } from "../utils/types";
import { useUserId } from "../services/useUserId";
import PostButton from "../elements/communityElements/PostButton";
import NewMessageModal from "../elements/communityElements/NewMessageModal";
import { addNewMessage } from "../services/messageServices";
import {
  addHabitLog,
  addHabitToDB,
  getHabitById,
} from "../services/dexieServices";
import { type Habit } from "../lib/db";
import { useStore } from "../lib/store";
import { USER_ID } from "../utils/constants";

export default function CommunityPage() {
  const clearList = useStore((state) => state.clearList);
  const addName = useStore((state) => state.addName);
  const list = useStore((state) => state.list);
  const addCommunityName = useStore((state) => state.addCommunityName);
  const currentCommunityName = useStore((state) => state.currentCommunityName);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityMessages, setCommunityMessages] = useState<
    CommunityMessage[]
  >([]);
  const [communityTitles, setCommunityTitles] = useState<string[]>([]);
  const [stateNewCommunityModal, setStateNewCommunityModal] = useState(false);
  const [stateNewMessageModal, setStateNewMessageModal] = useState(false);
  const [currentCommunityId, setCurrentCommunityId] = useState("");
  const [currentCommunityDescription, setCurrentCommunityDescription] =
    useState("");

  useEffect(() => {
    fetchCommunities();
    fetchCommunityMessages("");

    // Realtime Subscription
    const Communities = supabase
      .channel("name")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Communities",
        },

        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to changes!");
        } else if (status === "ERROR") {
          console.error("Error subscribing to changes.");
        }
      });

    return () => {
      supabase.removeChannel(Communities);
    };
  }, []);

  useEffect(() => {
    communityTitles.forEach((title) => {
      if (!list.includes(title)) {
        addName(title);
      }
    });
  }, [communityTitles]);

  useEffect(() => {
    setCurrentCommunityDescription("");
    getCommunityId(currentCommunityName);
  }, [currentCommunityName]);

  useEffect(() => {
    fetchCommunityMessages(currentCommunityId);
    setCurrentCommunityDescription(
      getCommunityDescriptionById(currentCommunityId)
    );
  }, [currentCommunityId]);

  const fetchCommunities = async () => {
    const data = await getAllCommunities();
    setCommunities(data);
    setCommunityTitles(data.map((community) => community.title));
  };

  const fetchCommunityMessages = async (communityId: string) => {
    if (communityId.toString() === "") {
      const data = await getAllCommunityMessages();
      setCommunityMessages(data);
    } else {
      const data = await getAllCommunityMessagesByCommunityId(communityId);
      setCommunityMessages(data);
    }
  };

  const getCommunityId = async (name: string) => {
    if (name.toString() !== "") {
      const data = await getCommunityIdByCommunityTitle(name);
      setCurrentCommunityId(data);
    }
  };

  const fetchHabitByHabitId = async (habitId: string) => {
    //vorrübergend mit dexie später mit supabase
    if (habitId) return await getHabitById(habitId);
    else {
      return null;
    }
  };

  const handleAddNewCommunityButton = async (
    title: string,
    description: string
  ) => {
    await addNewCommunity(USER_ID, title, description);
  };

  const handleAddNewMessageButton = async (
    communityId: string,
    title: string,
    description: string,
    habitId: string
  ) => {
    await addNewMessage(communityId, title, description, USER_ID, habitId);
    fetchCommunityMessages("");
  };

  const getCommunityNameById = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    const communityTitle = community ? community.title : "Unknown Community";
    return communityTitle;
  };

  const getCommunityDescriptionById = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    const communityDescription = community
      ? community.description
      : "Unknown Community";
    return communityDescription;
  };

  const handleOpenCommunityFeed = (communityId: string) => {
    setCurrentCommunityId(communityId);
    addCommunityName(getCommunityNameById(communityId));
  };

  const handleCopyHabit = async (title: string, days: string[]) => {
    await addHabitToDB(title, USER_ID, true, days);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white flex items-center justify-between py-2 px-4 w-full">
          <PostButton onClick={() => setStateNewMessageModal(true)} />
          <div className="flex-1 flex justify-center">
            <SearchBar data={communities} onClick={handleOpenCommunityFeed} />
          </div>
          <AddButton onClick={() => setStateNewCommunityModal(true)} />
        </div>
        <div className="flex-1 p-4">
          <NewCommunityModal
            currentTitles={communityTitles}
            isActive={stateNewCommunityModal}
            onClose={() => setStateNewCommunityModal(false)}
            onAddButton={handleAddNewCommunityButton}
          />
          <NewMessageModal
            isActive={stateNewMessageModal}
            currentCommunityId={currentCommunityId}
            communities={communities}
            onClose={() => setStateNewMessageModal(false)}
            onAddButton={handleAddNewMessageButton}
          />
          <div className="mt-4">
            {currentCommunityName !== "" && (
              
                <div className="w-full p-4 bg-gray-200 rounded-lg mb-4 mt-4 flex flex-col text-center items-center justify-center">
                  <h1 className="font-bold">{currentCommunityName}</h1>
                  <p className="mt-2">{currentCommunityDescription}</p>
                  <button
                    onClick={() => {}}
                    className="rounded-xl mt-4 bg-black font-bold text-white h-12 flex items-center justify-center shadow-lg text-l hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                    aria-label="Community beitreten"
                  >
                    Join Community
                  </button>
                </div>
                
             
            )}
            {communityMessages
              .slice() // create a shallow copy to avoid mutating state
              .sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              ) // sort oldest to newest
              .map((communityMessage: CommunityMessage) => (
                <MessageCard
                  key={communityMessage.id}
                  userId={communityMessage.user_id}
                  communityId={getCommunityNameById(
                    communityMessage.community_id
                  )}
                  title={communityMessage.title}
                  message={
                    communityMessage.message || "No description available"
                  }
                  habit={communityMessage.habit_id}
                  handleCopyHabit={handleCopyHabit}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
