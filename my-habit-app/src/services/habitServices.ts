import { supabase } from "../lib/supabase";

export async function getHabitByIdFromSupabase(habitId: string) {
  try {
    const { data, error } = await supabase
      .from("Habits")
      .select("*")
      .eq("id", habitId)
      .single();

    if (error) {
      console.error("Error fetching habit by ID:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error fetching habit by ID:", err);
    return null;
  }
}