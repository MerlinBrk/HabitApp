import { supabase } from "../lib/supabase";

export async function getAllCommentsByMessageId(messageId: string) {
  try {
    const { data, error } = await supabase
      .from("Community_comments")
      .select("*")
      .eq("message_id", messageId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching comments for a message", err);
    return [];
  }
}

export async function addNewCommentToMessage(
  messageId: string,
  userId: string,
  newMessage: string
) {
  try {
    const { error } = await supabase.from("Community_comments").insert([
      { message_id: messageId, user_id: userId, message: newMessage },
    ]);

    if (error) {
      throw error;
    }
  } catch (err) {
    console.error("Error adding a new comment", err);
    return;
  }
}
