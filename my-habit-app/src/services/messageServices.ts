import { supabase } from "../lib/supabase";

export async function addNewMessage(communityId:string, messageTitle:string, description:string, userId:string,habitId:string){
    try{
        if(habitId.toString() === "") habitId = habitId.toString();
        const {error} = await supabase.from("Community_messages").insert([{community_id: communityId, user_id:userId, title:messageTitle,message:description,habit_id:habitId }]);
        if(error){
            throw error;
        }
    }
    catch(err){
        console.error("Fehler beim Hinzufügen einer neuen Nachricht",err);
        return;
    }
}

export async function getAllCommunityMessages(){
  try {
    const { data, error } = await supabase
      .from("Community_messages")
      .select("*");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Community-Nachrichten:", error);
    return [];
  } 
}

export async function getAllMessagesByUserCommunities(userId: string) {
  try {
    // Hole alle Community-IDs, bei denen der User Mitglied ist
    const { data: communityUsers, error: communityUsersError } = await supabase
      .from("Community_users")
      .select("community_id")
      .eq("user_id", userId);

    if (communityUsersError) {
      throw communityUsersError;
    }

    const communityIds = communityUsers?.map((cu: any) => cu.community_id) || [];

    if (communityIds.length === 0) {
      return [];
    }

    // Hole alle Nachrichten aus diesen Communities
    const { data: messages, error: messagesError } = await supabase
      .from("Community_messages")
      .select("*")
      .in("community_id", communityIds);

    if (messagesError) {
      throw messagesError;
    }

    return messages || [];
  } catch (err) {
    console.error("Fehler beim Abrufen der Nachrichten für die Communities des Users", err);
    return [];
  }
}

export async function getAllCommunityMessagesByCommunityId(communityId: string) {
  try {
    const { data, error } = await supabase
      .from("Community_messages")
      .select("*")
      .eq("community_id", communityId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Beim Fetchen der Community Nachrichten mit einer bestimmten Id gab es ein Fehler", err);
    return [];
  }
}

export async function getCommunityMessageById(messageId:string){
  try{
const { data, error } = await supabase
      .from("Community_messages")
      .select("*")
      .eq("id", messageId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Beim Fetchen der Community Nachrichten mit einer bestimmten Id gab es ein Fehler", err);
    return;
  }
  
}

