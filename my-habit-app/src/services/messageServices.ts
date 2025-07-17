import { supabase } from "../lib/supabase";

export async function addNewMessage(communityId: string, messageTitle: string, description: string, userId: string, habitId: string) {
  try {
    if (!habitId) {
      const { error } = await supabase.from("Community_messages").insert([
        {
          community_id: communityId,
          user_id: userId,
          title: messageTitle,
          message: description,
          habit_id: null
        }
      ]);
      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("Community_messages").insert([
        {
          community_id: communityId,
          user_id: userId,
          title: messageTitle,
          message: description,
          habit_id: habitId
        }
      ]);
      if (error) {
        throw error;
      }
    }

  } catch (err) {
    console.error("Error while adding a new message", err);
    return;
  }
}

export async function getAllCommunityMessages() {
  try {
    const { data, error } = await supabase
      .from("Community_messages")
      .select("*");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error while fetching all community messages:", error);
    return [];
  } 
}

export async function getAllMessagesByUserCommunities(userId: string) {
  try {
    // Get all community IDs the user is a member of
    const { data: communityUsers, error: communityUsersError } = await supabase
      .from("Community_users")
      .select("community_id")
      .eq("user_id", userId);

    if (communityUsersError) {
      throw communityUsersError;
    }

    const communityIds = communityUsers?.map((cu: any) => cu.community_id) || [];

    if (communityIds.length === 0) {
      return [];
    }

    // Get all messages from these communities
    const { data: messages, error: messagesError } = await supabase
      .from("Community_messages")
      .select("*")
      .in("community_id", communityIds);

    if (messagesError) {
      throw messagesError;
    }

    return messages || [];
  } catch (err) {
    console.error("Error while fetching messages for the user's communities", err);
    return [];
  }
}

export async function getAllCommunityMessagesByCommunityId(communityId: string) {
  try {
    const { data, error } = await supabase
      .from("Community_messages")
      .select("*")
      .eq("community_id", communityId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error while fetching messages for the specified community ID", err);
    return [];
  }
}

export async function getCommunityMessageById(messageId: string) {
  try {
    const { data, error } = await supabase
      .from("Community_messages")
      .select("*")
      .eq("id", messageId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error while fetching message by ID", err);
    return;
  }
}
