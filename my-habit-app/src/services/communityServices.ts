import { supabase } from "../lib/supabase";

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
    const { error } = await supabase
  .from("Communities")
  .insert([
    { owner_id: userId, title: newTitle,description:newDescription },
  ])

}

  catch(err){
      console.error("Fehler beim Hinzufügen einer neuen Community",err);
      return;
  }
}