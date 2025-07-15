export type Community = {
  id: string;
  title: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

export type CommunityMessage = {
  id: string;
  community_id: string;
  user_id: string;
  title: string;
  message: string;
  habit_id: string;
  created_at: string;
}

export type CommunityComments = {
  id:string;
  message_id:string;
  user_id:string;
  message:string;
  created_at:string;
}