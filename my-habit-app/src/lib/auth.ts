// lib/auth.ts
import { supabase } from './supabase';

export async function syncUserIdToLocalStorage() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return;

  
  const userId = data.user.id;
  const userEmail = data.user.email;

  const { data: profile, error: profileError } = await supabase
    .from("Profiles")
    .select("username")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Fehler beim Laden des Profils:", profileError.message);
    return null;
  }

  if (!profile) {
    console.log("Kein Profil gefunden");
    return null;
  }
  localStorage.setItem('user_id', userId);
  localStorage.setItem('user_name',profile.username);
  localStorage.setItem('user_email',userEmail);
}