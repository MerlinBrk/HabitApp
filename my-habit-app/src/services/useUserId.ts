// services/useUserId.ts
export function useUserId() {
  return localStorage.getItem("user_id") ?? "offline-user";
}

export function useUserName(){
  return localStorage.getItem("user_name") ?? "offline-user";
}