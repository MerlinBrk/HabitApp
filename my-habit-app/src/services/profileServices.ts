import { supabase } from "../lib/supabase";

export async function getUsernameById(userId:string) {
  if (!userId) {
    console.error("Keine userId übergeben");
    return null;
  }

  const { data, error } = await supabase
    .from("Profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Fehler beim Laden des Benutzernamens:", error.message);
    return "";
  }

  return data?.username || "";
}