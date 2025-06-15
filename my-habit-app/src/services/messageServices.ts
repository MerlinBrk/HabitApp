import { supabase } from "../lib/supabase";

export async function addNewMessage(communityId:string, messageTitle:string, description:string, userId:string,habitId:string){
    try{
        const {error} = await supabase.from("Community_messages").insert([{community_id: communityId, user_id:userId, title:messageTitle,message:description,habit_id:habitId }]);
        if(error){
            throw "Error beim Hinzufügen";
        }
    }
    catch(err){
        console.error("Fehler beim Hinzufügen einer neuen Nachricht",err);
        return;
    }
}