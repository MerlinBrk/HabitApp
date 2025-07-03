import { supabase } from "../lib/supabase";

export async function addNewCommunityUser(communityId:string,userId: string){
  try{
    const { error } = await supabase
  .from("Community_users")
  .insert([
    { community_id:communityId,user_id:userId },
  ])

}

  catch(err){
      console.error("Fehler beim Hinzufügen eines neuen Community Users",err);
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
        console.error("Fehler beim Löschen eines Community Users", err);
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

        if (error && error.code !== "PGRST116") { // PGRST116: No rows found
            console.error("Fehler beim Überprüfen der Community-Mitgliedschaft", error);
            return false;
        }

        return !!data;
    } catch (err) {
        console.error("Fehler beim Überprüfen der Community-Mitgliedschaft", err);
        return false;
    }
}