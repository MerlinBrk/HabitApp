import SearchBar from "../elements/communityElements/SearchBar";
import SideBar from "../elements/SideBar";
import React, { useEffect, useState } from "react";
import {
  getAllCommunities,
  getAllCommunityMessages,
  addNewCommunity
} from "../services/communityServices";
import { supabase } from "../lib/supabase";
import MessageCard from "../elements/communityElements/MessageCard";
import NewCommunityModal from "../elements/communityElements/NewCommunityModal";
import AddButton from "../elements/AddButton";
import { type Community, type CommunityMessage } from "../utils/types";
import { useUserId } from "../services/useUserId";

export function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityMessages, setCommunityMessages] = useState<
    CommunityMessage[]
  >([]);
  const [communityTitles, setCommunityTitles] = useState<string[]>([]);
  const [stateNewCommunityModal, setStateNewCommunityModal] = useState(false);

   const USER_ID = useUserId();

  useEffect(() => {
    fetchCommunities();
    fetchCommunityMessages();
    // Realtime Subscription
    const Communities = supabase
      .channel("name")
      .on(
        "POSTGRES_CHANGE",
        { event: "INSERT", schema: "public", table: "Communities" },
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

  const addANewCommunity = async (title: string, description:string)=>{
      await addNewCommunity(USER_ID,title,description);
  };

  const handleAddNewCommunityButton = async (title: string, description:string)=>{
    addANewCommunity(title,description);
  }
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
            onAddButton={
              handleAddNewCommunityButton
            }
          />
          <div className="text-gray-700 text-lg"></div>
          <SearchBar data={communityTitles} />
          <div className="fixed top-8 right-16 z-40">
            <AddButton
              onClick={() => {
                setStateNewCommunityModal(true);
              }}
            />
          </div>
          <div className="mt-4">
            {communityMessages.map((communityMessage) => (
              <MessageCard
                key={communityMessage.id}
                userId={communityMessage.user_id}
                communityId={communityMessage.community_id}
                message={communityMessage.message || "No description available"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
