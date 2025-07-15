import { supabase } from "./supabase";
import { getUsernameById } from "../services/profileServices";

export async function getUserIdFromSession(): Promise<string > {
    if(navigator.onLine) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user?.id) return "";
  return data.session.user.id;
}else{
    return localStorage.getItem("user_id") || "";
}
}

export async function getUserEmailFromSession():Promise<string> {
    if(navigator.onLine) {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.user?.email) return "";
        return data.session.user.email;
    }else{
        return localStorage.getItem("user_email") || "";
    }
}

export async function getUsernameBySession(){
    if(navigator.onLine){
        const userId = await getUserIdFromSession();
        const data = await getUsernameById(userId);
        if (data) {
            return data;
        } else {
            console.error("Fehler beim Abrufen des Benutzernamens");
        }
    }
    else{
        return localStorage.getItem("user_name");
    }
}