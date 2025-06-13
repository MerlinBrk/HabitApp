// services/useUserId.ts
export function useUserId() {
  return localStorage.getItem("user_id") ?? "offline-user";
}