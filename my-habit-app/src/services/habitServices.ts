import { supabase } from "../lib/supabase";

export async function getHabitByIdFromSupabase(habitId: string) {
  try {
    console.log("Fetching habit with ID:", habitId);
    const { data, error } = await supabase
      .from("Habits")
      .select("*")
      .eq("id", habitId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching habit by ID:", err);
    return null;
  }
}