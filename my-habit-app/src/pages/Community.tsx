import SearchBar from "../elements/communityElements/SearchBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
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
import NewCommunityButton from "../elements/communityElements/NewCommunityButton";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);


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
    console.log("Own Communities: ", data);
    clearList();
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
      fetchOwnCommunities();

  };

  const leaveCommunity = async(communityId:string) => {
    await deleteCommunityUser(communityId,USER_ID);
    setPartOfCurrentCommunity(false);
    fetchOwnCommunities();

  }
  const fetchpartOfCommunity = async(CommunityId:string) => {
    if(CommunityId !== ""){
      const data = await getIfUserIsPartOfCommunity(CommunityId,USER_ID);
      setPartOfCurrentCommunity(data);
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
    {/* Titel ganz oben */}
    <div className="sm:hidden flex items-center px-4 pt-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 focus:outline-none"
          aria-label="Open menu"
        >
          <Bars3Icon className="h-7 w-7" />
        </button>
        <h1 className="text-2xl font-bold ml-4">Community</h1>
      </div>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative bg-white w-64 h-full shadow-lg z-50 p-6">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-700"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Communities</h2>
            <ul>
              {communities.map((c) => (
                <li key={c.id}>
                  <button
                    className="w-full text-left py-2 px-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      handleOpenCommunityFeed(c.id);
                      setSidebarOpen(false);
                    }}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    <div className="max-w-7xl mx-auto w-full px-4 pt-6 mb-6 hidden sm:block">
      <h1 className="text-3xl font-bold">Community
      </h1>
    </div>
    <div className="flex-1 flex">
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white w-full py-2 px-4">
          {/* ... */}
          <div className="hidden sm:flex items-center justify-between w-full">
            <PostButton onClick={() => setStateNewMessageModal(true)} />
            <div className="flex-1 flex justify-center">
              <SearchBar data={communities} onClick={handleOpenCommunityFeed} />
            </div>
            <NewCommunityButton onClick={() => setStateNewCommunityModal(true)} />
          </div>
          {/* Mobile layout */}
          <div className="flex flex-col sm:hidden w-full">
            <div className="mb-2">
              <SearchBar data={communities} onClick={handleOpenCommunityFeed} />
            </div>
            <div className="flex justify-between w-full">
              <PostButton onClick={() => setStateNewMessageModal(true)} />
              <NewCommunityButton onClick={() => setStateNewCommunityModal(true)} />
            </div>
          </div>
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
  <div className="w-full p-6 bg-gray-200 rounded-lg mb-4 mt-4 flex flex-row sm:flex-row flex-col justify-between items-center sm:items-center">
    <div className="flex flex-col max-w-xs w-full">
      <h1 className="font-bold">{currentCommunityName}</h1>
      <p className="mt-2 break-words line-clamp-3">{currentCommunityDescription}</p>
      {/* Mobile: Join/Leave Button unterhalb von Title/Description */}
      <div className="mt-4 sm:hidden">
        {!partOfCurrentCommunity ? (
          <JoinLeaveButton title="Join Community" onClick={() => joinCommunity(currentCommunityId)} />
        ) : (
          <JoinLeaveButton title="Leave Community" onClick={() => leaveCommunity(currentCommunityId)} />
        )}
      </div>
    </div>
    {/* Desktop: Join/Leave Button rechts */}
    <div className="ml-4 hidden sm:block">
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
                  messageId={communityMessage.id}
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
              {communityMessages.length === 0&& (
                <div className="text-center text-gray-500 mt-4">
                  No Messages found
                </div>
              )}

          </div>
        </div>
      </div>
    </div>
    </div>
  );
}











  



