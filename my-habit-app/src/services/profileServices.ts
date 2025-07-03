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

export async function uploadProfileImage(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const folderPath = `${userId}/`;

  // Liste alle Dateien im User-Ordner auf
  const { data: listData, error: listError } = await supabase.storage
    .from('avatars')
    .list(folderPath);

  if (listError) throw listError;

  // Lösche alle vorhandenen Dateien im User-Ordner
  if (listData && listData.length > 0) {
    for (const item of listData) {
      await supabase.storage
        .from('avatars')
        .remove([`${folderPath}${item.name}`]);
    }
  }

  const filePath = `${userId}/avatar.${fileExt}`;

  // Upload zum Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Bild-URL generieren (entweder öffentlich oder über signierte URL)
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const { error: dbError } = await supabase
    .from('Profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (dbError) throw dbError;

  return publicUrl;
}

export async function getProfileImageUrl(userId: string) {
  if (!userId) {
    console.error("Keine userId übergeben");
    return null;
  }

  const { data, error } = await supabase
    .from("Profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Fehler beim Laden des Profilbilds:", error.message);
    return null;
  }

  return data?.avatar_url || null;
}
