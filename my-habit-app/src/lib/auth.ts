// lib/auth.ts
import { supabase } from './supabase';

export async function syncUserIdToLocalStorage() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return;

  const userName = data.user.user_metadata?.display_name;
  const userId = data.user.id;
  localStorage.setItem('user_id', userId);
  localStorage.setItem('user_name',userName);
}