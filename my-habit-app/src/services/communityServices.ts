import { supabase } from "../lib/supabase";
import { addNewCommunityUser } from "./commUserServices";

export async function getAllCommunities() {
  try {
    const { data, error } = await supabase
      .from("Communities")
      .select("*");
    
    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Communities:", error);
    return [];
  }
}

export async function getAllCommunityTitles() {
  try {
    const { data, error } = await supabase
      .from("Communities")
      .select("title"); 

    if (error) {
      throw error;
    }   
    return data?.map((community: { title: string }) => community.title) || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Community-Titel:", error);
    return [];
  }
}

export async function getCommunityNameById(communityId: string) {
  try {
    const { data, error } = await supabase
      .from("Communities")
      .select("title")
      .eq("id", communityId)
      .single();

    if (error) {
      throw error;
    }

    return data?.title || "";
  } catch (error) {
    console.error("Fehler beim Abrufen des Community-Namens:", error);
    return "";
  }
}

export async function getCommunityDesctiptionById(communityId:string){
  try {
    const { data, error } = await supabase
      .from("Communities")
      .select("description")
      .eq("id", communityId)
      .single();

    if (error) {
      throw error;
    }

    return data?.description || "";
  } catch (error) {
    console.error("Fehler beim Abrufen der Community-Description:", error);
    return "";
  }
}

export async function getCommunityIdByCommunityTitle(communityTitle:string){
try{
  const {data,error} = await supabase.from("Communities").select("id").eq("title",communityTitle).single();
  if(!error){
    return data?.id;
  }
  else{
    throw error;
  }
}catch(err){
  console.error("Fehler beim Fetchen einer Communtiy mit bestimmtem Titel",err);
  return "";
}
}



export async function addNewCommunity(userId: string, newTitle:string, newDescription:string){
  try{
    const { data, error } = await supabase
      .from("Communities")
      .insert([
        { owner_id: userId, title: newTitle, description: newDescription },
      ])
      .select()
      .single(); // erwartet genau einen Eintrag
  if(error) {
    throw error;
  }
  const {error:userError } = await addNewCommunityUser(data.id, userId);
  if(userError) {
    throw userError;
  }

}

  catch(err){
      console.error("Fehler beim Hinzufügen einer neuen Community",err);
      return;
  }
}


export async function getCommunitiesByUserId(userId:string){
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

    // Hole alle Communities mit diesen IDs
    const { data: communities, error: communitiesError } = await supabase
      .from("Communities")
      .select("*")
      .in("id", communityIds);

    if (communitiesError) {
      throw communitiesError;
    }

    return communities || [];
  }
  catch(err){
    console.error("Fehler beim Fetchen der subscripten Communities",err);
      return;
  }
}
