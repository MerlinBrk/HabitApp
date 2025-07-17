import { supabase } from "../lib/supabase";

export async function addNewCommunityUser(communityId:string,userId: string){
  try{
    const { error } = await supabase
  .from("Community_users")
  .insert([
    { community_id:communityId,user_id:userId },
  ])
  if(error) throw error;
}

  catch(err){
      console.error("Error Adding a new Community User",err);
      return;
  }
}

export async function deleteCommunityUser(communityId:string,userId:string) {
    try {
        const { error } = await supabase
            .from("Community_users")
            .delete()
            .eq("community_id", communityId)
            .eq("user_id", userId);

        if (error) {
            throw error;
        }
    } catch (err) {
        console.error("Error Deleting User from Community", err);
        return;
    }
}

export async function getIfUserIsPartOfCommunity(communityId: string, userId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from("Community_users")
            .select("id")
            .eq("community_id", communityId)
            .eq("user_id", userId)
            .single();

        if (error && error.code !== "PGRST116") { 
            throw error;
            return false;
        }

        return !!data;
    } catch (err) {
        console.error("Error Fetching Community Subscription", err);
        return false;
    }
}