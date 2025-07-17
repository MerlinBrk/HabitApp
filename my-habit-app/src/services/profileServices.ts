import { supabase } from "../lib/supabase";

export async function getUserEmailById(userId: string) {
  if (!userId) {
    console.error("No userId provided");
    return null;
  }

  const { data, error } = await supabase
    .from("Profiles")
    .select("email")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error loading email:", error.message);
    return null;
  }

  return data?.email || null;
}

export async function getUsernameById(userId: string) {
  if (!userId) {
    console.error("No userId provided");
    return null;
  }

  const { data, error } = await supabase
    .from("Profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error loading username:", error.message);
    return "";
  }

  return data?.username || "";
}

export async function uploadProfileImage(userId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const folderPath = `${userId}/`;

  // List all files in the user's folder
  const { data: listData, error: listError } = await supabase.storage
    .from("avatars")
    .list(folderPath);

  if (listError) throw listError;

  // Delete all existing files in the user's folder
  if (listData && listData.length > 0) {
    for (const item of listData) {
      await supabase.storage
        .from("avatars")
        .remove([`${folderPath}${item.name}`]);
    }
  }

  const filePath = `${userId}/avatar.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Generate image URL (either public or signed)
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: dbError } = await supabase
    .from("Profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", userId);

  if (dbError) throw dbError;

  return publicUrl;
}

export async function getProfileImageUrl(userId: string) {
  if (!userId) {
    console.error("No userId provided");
    return null;
  }

  const { data, error } = await supabase
    .from("Profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error loading profile image:", error.message);
    return null;
  }

  return data?.avatar_url || null;
}
