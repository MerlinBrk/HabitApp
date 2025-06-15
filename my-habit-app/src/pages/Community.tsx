import SearchBar from "../elements/communityElements/SearchBar";
import SideBar from "../elements/SideBar";
import React, { useEffect, useState } from "react";
import {
  getAllCommunities,
  getAllCommunityMessages,
  addNewCommunity,
} from "../services/communityServices";
import { supabase } from "../lib/supabase";
import MessageCard from "../elements/communityElements/MessageCard";
import NewCommunityModal from "../elements/communityElements/NewCommunityModal";
import AddButton from "../elements/AddButton";
import { type Community, type CommunityMessage } from "../utils/types";
import { useUserId } from "../services/useUserId";
import PostButton from "../elements/communityElements/PostButton";
import NewMessageModal from "../elements/communityElements/NewMessageModal";
import { addNewMessage } from "../services/messageServices";

export function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityMessages, setCommunityMessages] = useState<
    CommunityMessage[]
  >([]);
  const [communityTitles, setCommunityTitles] = useState<string[]>([]);
  const [stateNewCommunityModal, setStateNewCommunityModal] = useState(false);
  const [stateNewMessageModal, setStateNewMessageModal] = useState(false);

  const USER_ID = useUserId();

  useEffect(() => {
    fetchCommunities();
    fetchCommunityMessages();
    // Realtime Subscription
    const Communities = supabase
      .channel("name")
      .on(
        'postgres_changes',
        { event: "*", schema: "public", table: "Communities" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(Communities);
    };
  }, []);

  const fetchCommunities = async () => {
    const data = await getAllCommunities();
    setCommunities(data);
    setCommunityTitles(data.map((community) => community.title));
  };

  const fetchCommunityMessages = async () => {
    const data = await getAllCommunityMessages();
    setCommunityMessages(data);
  };

  const addANewCommunity = async (title: string, description: string) => {
    await addNewCommunity(USER_ID, title, description);
  };

  const handleAddNewCommunityButton = async (
    title: string,
    description: string
  ) => {
    addANewCommunity(title, description);
  };

  const handleAddNewMessageButton = async (
    communityId: string,
    title: string,
    description: string,
    habitId: string
  ) => {
    await addNewMessage(communityId, title, description, USER_ID);
  };

  const getCommunityNameById = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    const communityTitle = community ? community.title : "Unknown Community";
    return communityTitle;
  };
  return (
    <div className="flex h-screen w-screen">
      <SideBar isOpen={true} onClose={() => {}} />

      <div className="sm:ml-64 p-4 flex-1 bg-white overflow-auto border-l border-gray-300">
        <div className="w-full h-full bg-white rounded-none shadow-none p-4 relative">
          {/* Statistik-Inhalte kommen hier hin */}
          <NewCommunityModal
            currentTitles={communityTitles}
            isActive={stateNewCommunityModal}
            onClose={() => {
              setStateNewCommunityModal(false);
            }}
            onAddButton={handleAddNewCommunityButton}
          />
          <NewMessageModal
            isActive={stateNewMessageModal}
            communities={communities}
            onClose={() => {
              setStateNewMessageModal(false);
            }}
            onAddButton={handleAddNewMessageButton}
          />
          <div className="fixed z-40">
            <PostButton
              onClick={() => {
                setStateNewMessageModal(true);
              }}
            />
          </div>
          <SearchBar data={communityTitles} />
          <div className="fixed top-8 right-16 z-40">
            <AddButton
              onClick={() => {
                setStateNewCommunityModal(true);
              }}
            />
          </div>
          <div className="mt-4">
            {communityMessages.map((communityMessage) => {
              return (
                <MessageCard
                  key={communityMessage.id}
                  userId={communityMessage.user_id}
                  communityId={getCommunityNameById(communityMessage.community_id)}
                  title={communityMessage.title}
                  message={
                    communityMessage.message || "No description available"
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
