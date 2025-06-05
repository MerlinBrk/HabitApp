// lib/auth.ts
import { supabase } from './supabase';

export async function syncUserIdToLocalStorage() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return;

  const userId = data.user.id;
  localStorage.setItem('user_id', userId);
}