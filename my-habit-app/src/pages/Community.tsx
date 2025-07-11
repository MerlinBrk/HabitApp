import SearchBar from "../elements/communityElements/SearchBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  getAllCommunities,
  addNewCommunity,
  getCommunityIdByCommunityTitle,
  getCommunitiesByUserId,
} from "../services/communityServices";
import CommentModal from "../elements/communityElements/CommentModal";
import {
  getAllCommunityMessages,
  getAllCommunityMessagesByCommunityId,
  getAllMessagesByUserCommunities,
} from "../services/messageServices";
import MessageCard from "../elements/communityElements/MessageCard";
import NewCommunityModal from "../elements/communityElements/NewCommunityModal";
import AddButton from "../elements/AddButton";
import { type Community, type CommunityMessage } from "../utils/types";
import PostButton from "../elements/communityElements/PostButton";
import NewMessageModal from "../elements/communityElements/NewMessageModal";
import { addNewMessage } from "../services/messageServices";
import { addHabitToDB, getHabitById } from "../services/dexieServices";
import { type Habit } from "../lib/db";
import { useStore } from "../lib/store";
import { USER_ID } from "../utils/constants";
import {
  addNewCommunityUser,
  deleteCommunityUser,
  getIfUserIsPartOfCommunity,
} from "../services/commUserServices";
import JoinLeaveButton from "../elements/communityElements/JoinLeaveButton";
import NewCommunityButton from "../elements/communityElements/NewCommunityButton";

export default function CommunityPage() {
  const clearList = useStore((state) => state.clearList);
  const addName = useStore((state) => state.addName);
  const list = useStore((state) => state.list);
  const addCommunityId = useStore((state) => state.addCommunityName);
  const currentCommunityId = useStore((state) => state.currentCommunityName);
  const clearCommunityId = useStore((state) => state.clearCommunityname);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [currentCommunityForCommentModal, setCurrentCommunityForCommentModal] =
    useState("");
  const [communityMessages, setCommunityMessages] = useState<
    CommunityMessage[]
  >([]);
  const [communityTitles, setCommunityTitles] = useState<string[]>([]);
  const [stateNewCommunityModal, setStateNewCommunityModal] = useState(false);
  const [stateNewMessageModal, setStateNewMessageModal] = useState(false);
  const [currentCommunityDescription, setCurrentCommunityDescription] =
    useState("");
  const [partOfCurrentCommunity, setPartOfCurrentCommunity] = useState(false);
  const [loadingCommunityInfo, setLoadingCommunityInfo] = useState(true);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullSidebarOpen, setFullSidebarOpen] = useState(false);
  const [currentCommunityName, setCurrentCommunityName] = useState("");

  useEffect(() => {
    fetchAll();
    clearCommunityId();
    clearList();
  }, []);

  useEffect(() => {
    userCommunities.forEach((community) => {
      if (!list.includes(community.title)) {
        addName(community.id, community.title);
      }
    });
  }, [userCommunities]);

  useEffect(() => {
    
    if (currentCommunityId) {
      fetchCommunityDetails();
    }
  }, [currentCommunityId]);

  const fetchAll = () => {
    fetchCommunities();
    fetchOwnCommunities();
    fetchMessages();
  };

  const fetchCommunities = async () => {
    const data = await getAllCommunities();
    setCommunities(data);
  };

  const fetchOwnCommunities = async () => {
    const data = await getCommunitiesByUserId(USER_ID);
    clearList();
    setCommunityTitles(data.map((community) => community.title));
    setUserCommunities(data);
  };

  const fetchMessages = async (communityId: string) => {
    if (currentCommunityId) {
      fetchCommunityFeed();
    } else {
      fetchUserFeed();
    }
  };

  const fetchCommunityFeed = async () => {
    if (currentCommunityId) {
      const data =
        await getAllCommunityMessagesByCommunityId(currentCommunityId);
      setCommunityMessages(data);
    }
  };

  const fetchUserFeed = async () => {
    const data = await getAllMessagesByUserCommunities(USER_ID);
    setCommunityMessages(data);
  };


  const fetchCommunityDetails = async() => {
    if (currentCommunityId) {
      setLoadingCommunityInfo(true);
      fetchMessages();
      fetchCommunityDescriptionById(currentCommunityId);
      await fetchpartOfCommunity(currentCommunityId);
      fetchCommunityNameById(currentCommunityId);
      setLoadingCommunityInfo(false);
    }

  }

  const fetchCommunityNameById = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    const communityTitle = community ? community.title : "Unknown Community";
   setCurrentCommunityName(communityTitle);
  };

  const fetchCommunityDescriptionById = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    const communityDescription = community
      ? community.description
      : "Unknown Community";
    setCurrentCommunityDescription(communityDescription);
  };

  const fetchpartOfCommunity = async (CommunityId: string) => {
    if (CommunityId !== "") {
      const data = await getIfUserIsPartOfCommunity(CommunityId, USER_ID);
      setPartOfCurrentCommunity(data);
    }
  };

  const getCommunityNameById = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    const communityTitle = community ? community.title : "Unknown Community";
    return communityTitle;
  };

  const handleOpenCommunityFeed = (communityId: string) => {
    addCommunityId(communityId);
  };

  const handleCopyHabit = async (title: string, days: string[]) => {
    await addHabitToDB(title, USER_ID, true, days);
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
    fetchMessages();
  };

  const joinCommunity = async (communityId: string) => {
    await addNewCommunityUser(communityId, USER_ID);
    fetchCommunityMessages();
    setPartOfCurrentCommunity(true);
    fetchOwnCommunities();
  };

  const leaveCommunity = async (communityId: string) => {
    await deleteCommunityUser(communityId, USER_ID);
    setPartOfCurrentCommunity(false);
    fetchOwnCommunities();
  };
  

  return (
    <div className="flex h-screen w-full flex-col bg-white">
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
              {(fullSidebarOpen ? list : list.slice(0, 5)).map(
                (item, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <button
                      className="flex items-center block px-2 py-1 font-bold rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-colors no-underline flex-1 w-full"
                      onClick={() => {
                        addCommunityId(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 font-bold text-lg mr-2">
                        {item.charAt(0).toUpperCase()}
                      </div>
                      {item}
                    </button>
                  </li>
                )
              )}
              {list.length > 5 && !fullSidebarOpen && (
                <li>
                  <button
                    aria-label="Show more communities"
                    className="text-black px-2 py-1"
                    onClick={() => setFullSidebarOpen(true)}
                  >
                    Zeige mehr...
                  </button>
                </li>
              )}
              {list.length > 5 && fullSidebarOpen && (
                <li>
                  <button
                    aria-label="Show less communities"
                    className="text-black px-2 py-1"
                    onClick={() => setFullSidebarOpen(false)}
                  >
                    Weniger anzeigen
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40 bg-white w-full py-2 px-4 pb-2">
            <div className="sm:hidden flex items-center pt-4 pb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="ml-2 p-0 text-gray-700 focus:outline-none hover:bg-transparent active:bg-transparent"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-7 w-7" />
              </button>
              <h1 className="text-3xl font-bold ml-4 tracking-tight ">
                Community
              </h1>
            </div>

            <div className="max-w-7xl mx-auto w-full  pt-6 mb-6 hidden sm:block">
              <h1 className="text-3xl font-bold">Community</h1>
            </div>
            {/* ... */}
            <div className="hidden sm:flex items-center justify-between w-full">
              <PostButton onClick={() => setStateNewMessageModal(true)} />
              <div className="flex-1 flex justify-center">
                <SearchBar
                  data={communities}
                  onClick={handleOpenCommunityFeed}
                />
              </div>
              <NewCommunityButton
                onClick={() => setStateNewCommunityModal(true)}
              />
            </div>
            {/* Mobile layout */}
            <div className="flex flex-col sm:hidden w-full">
              <div className="mb-2">
                <SearchBar
                  data={communities}
                  onClick={handleOpenCommunityFeed}
                />
              </div>
              <div className="flex justify-between w-full">
                <PostButton onClick={() => setStateNewMessageModal(true)} />
                <NewCommunityButton
                  onClick={() => setStateNewCommunityModal(true)}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto hide-scrollbar">
            <CommentModal
              isActive={commentModalOpen}
              message_id={currentCommunityForCommentModal}
              handleCommentModalClose={() => setCommentModalOpen(false)}
            />
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
              {currentCommunityId && !loadingCommunityInfo &&(
                <div className="w-full p-6 bg-gray-200 rounded-lg mb-4 mt-4 flex flex-row sm:flex-row flex-col justify-between items-center sm:items-center">
                  <div className="flex flex-col w-full">
                    <h1 className="font-bold">{currentCommunityName}</h1>
                    <p className="mt-2 break-words line-clamp-3">
                      {currentCommunityDescription}
                    </p>
                    {/* Mobile: Join/Leave Button unterhalb von Title/Description */}
                    <div className="mt-4 sm:hidden">
                      {!partOfCurrentCommunity ? (
                        <JoinLeaveButton
                          title="Join Community"
                          onClick={() => joinCommunity(currentCommunityId)}
                        />
                      ) : (
                        <JoinLeaveButton
                          title="Leave Community"
                          onClick={() => leaveCommunity(currentCommunityId)}
                        />
                      )}
                    </div>
                  </div>
                  {/* Desktop: Join/Leave Button rechts */}
                  <div className="ml-4 hidden sm:block">
                    {!partOfCurrentCommunity ? (
                      <JoinLeaveButton
                        title="Join Community"
                        onClick={() => joinCommunity(currentCommunityId)}
                      />
                    ) : (
                      <JoinLeaveButton
                        title="Leave Community"
                        onClick={() => leaveCommunity(currentCommunityId)}
                      />
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
                    handleCommentOpen={() => {
                      setCommentModalOpen(true);
                      setCurrentCommunityForCommentModal(communityMessage.id);
                    }}
                  />
                ))}
              {communityMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                  No Messages found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full sm:hidden"></div>
    </div>
  );
}
