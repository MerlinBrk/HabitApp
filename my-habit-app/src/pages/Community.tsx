import SearchBar from "../elements/communityElements/SearchBar";
import React, { useEffect, useState } from "react";
import {
  getAllCommunities,
  addNewCommunity,
  getCommunityIdByCommunityTitle,
  getCommunitiesByUserId
} from "../services/communityServices";
import CommentModal from "../elements/communityElements/CommentModal";
import {
  getAllCommunityMessages,
  getAllCommunityMessagesByCommunityId,
  getAllMessagesByUserCommunities
} from "../services/messageServices";
import MessageCard from "../elements/communityElements/MessageCard";
import NewCommunityModal from "../elements/communityElements/NewCommunityModal";
import AddButton from "../elements/AddButton";
import { type Community, type CommunityMessage } from "../utils/types";
import PostButton from "../elements/communityElements/PostButton";
import NewMessageModal from "../elements/communityElements/NewMessageModal";
import { addNewMessage } from "../services/messageServices";
import {
  addHabitToDB,
  getHabitById,
} from "../services/dexieServices";
import { type Habit } from "../lib/db";
import { useStore } from "../lib/store";
import { USER_ID } from "../utils/constants";
import { addNewCommunityUser, deleteCommunityUser, getIfUserIsPartOfCommunity } from "../services/commUserServices";
import JoinLeaveButton from "../elements/communityElements/JoinLeaveButton";

export default function CommunityPage() {
  const clearList = useStore((state) => state.clearList);
  const addName = useStore((state) => state.addName);
  const list = useStore((state) => state.list);
  const addCommunityName = useStore((state) => state.addCommunityName);
  const currentCommunityName = useStore((state) => state.currentCommunityName);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities,setUserCommunities] = useState<Community[]>([]);
  const [currentCommunityForCommentModal,setCurrentCommunityForCommentModal] = useState("");
  const [communityMessages, setCommunityMessages] = useState<
    CommunityMessage[]
  >([]);
  const [communityTitles, setCommunityTitles] = useState<string[]>([]);
  const [stateNewCommunityModal, setStateNewCommunityModal] = useState(false);
  const [stateNewMessageModal, setStateNewMessageModal] = useState(false);
  const [currentCommunityId, setCurrentCommunityId] = useState("");
  const [currentCommunityDescription, setCurrentCommunityDescription] =useState("");
  const [partOfCurrentCommunity,setPartOfCurrentCommunity] = useState(false);
  const [loadingCommunityInfo, setLoadingCommunityInfo] = useState(false);
  const [commentModalOpen,setCommentModalOpen] = useState(false);


  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    communityTitles.forEach((title) => {
      if (!list.includes(title)) {
        addName(title);
      }
    });
  }, [communityTitles]);

  useEffect(() => {
  if (currentCommunityName) {
    loadCommunityInfo(currentCommunityName);
  }
}, [currentCommunityName]);

const loadCommunityInfo = async (name: string) => {
  setLoadingCommunityInfo(true); // Start Loading
  setCurrentCommunityDescription("");
  await getCommunityIdByName(name); // ruft communityId und setzt es
  setLoadingCommunityInfo(false); // End Loading
};

useEffect(() => {
  if (currentCommunityId) {
    fetchCommunityMessages(currentCommunityId);
    setCurrentCommunityDescription(getCommunityDescriptionById(currentCommunityId));
    fetchpartOfCommunity(currentCommunityId);
  }
}, [currentCommunityId]);


  const fetchAll = () =>{
    fetchCommunities();
    fetchOwnCommunities();
    fetchCommunityMessages(""); 
  }

  const fetchCommunities = async () => {
    const data = await getAllCommunities();
    setCommunities(data);
  };

  const fetchOwnCommunities = async () => {
    const data = await getCommunitiesByUserId(USER_ID);
    setCommunityTitles(data.map((community) => community.title));
    setUserCommunities(data);
  }

  const fetchCommunityMessages = async (communityId: string) => {
    if (communityId.toString() === "") {
      const data = await getAllMessagesByUserCommunities(USER_ID);
      setCommunityMessages(data);
    } else {
      const data = await getAllCommunityMessagesByCommunityId(communityId);
      setCommunityMessages(data);
    }
  };

  const getCommunityIdByName = async (name: string) => {
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

  const joinCommunity = async(communityId:string) =>{
      await addNewCommunityUser(communityId,USER_ID);
      fetchCommunityMessages();
      setPartOfCurrentCommunity(true);
  };

  const leaveCommunity = async(communityId:string) => {
    await deleteCommunityUser(communityId,USER_ID);
    setPartOfCurrentCommunity(false);
  }
  const fetchpartOfCommunity = async(CommunityId:string) => {
    if(CommunityId !== ""){
      const data = await getIfUserIsPartOfCommunity(CommunityId,USER_ID);
      setPartOfCurrentCommunity(data);
    }
  }

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
          <CommentModal isActive={commentModalOpen} message_id={currentCommunityForCommentModal} handleCommentModalClose={() => setCommentModalOpen(false)}/>
          <NewCommunityModal
            currentTitles={communityTitles}
            isActive={stateNewCommunityModal}
            onClose={() => setStateNewCommunityModal(false)}
            onAddButton={handleAddNewCommunityButton}
          />
          <NewMessageModal
            isActive={stateNewMessageModal}
            currentCommunityId={currentCommunityId}
            communities={userCommunities}
            onClose={() => setStateNewMessageModal(false)}
            onAddButton={handleAddNewMessageButton}
          />
          <div className="mt-4">
            {currentCommunityName !== "" && (
              
                <div className="w-full p-6 bg-gray-200 rounded-lg mb-4 mt-4 flex flex-row justify-between items-center">
                    <div className="flex flex-col max-w-xs">
                    <h1 className="font-bold">{currentCommunityName}</h1>
                    <p className="mt-2 break-words line-clamp-3">{currentCommunityDescription}</p>
                    </div>
                  <div className="ml-4">
                    {!partOfCurrentCommunity ? (
                      <JoinLeaveButton title="Join Community" onClick={() => joinCommunity(currentCommunityId)} />
                    ) : (
                      <JoinLeaveButton title="Leave Community" onClick={() => leaveCommunity(currentCommunityId)} />
                    )}
                  </div>
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
                  communityName={getCommunityNameById(
                    communityMessage.community_id
                  )}
                  title={communityMessage.title}
                  message={
                    communityMessage.message || "No description available"
                  }
                  habit={communityMessage.habit_id}
                  handleCopyHabit={handleCopyHabit}
                  handleCommentOpen={() => {setCommentModalOpen(true); setCurrentCommunityForCommentModal(communityMessage.id);}}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
