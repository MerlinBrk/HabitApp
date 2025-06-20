import { supabase } from "../lib/supabase";

export async function addNewMessage(communityId:string, messageTitle:string, description:string, userId:string,habitId:string){
    try{
        if(habitId.toString() === "")habitId = null;
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

