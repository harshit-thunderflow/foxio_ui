import { useState, useEffect, useCallback } from "react";
import { fetchUserMeApi, type UserMe } from "@/services/user";
import { useAuth } from "./useAuth";

export function useUser() {
  const { isAuthenticated, logout } = useAuth();
  const [userMe, setUserMe] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserMeApi();
      setUserMe(data);
    } catch (err: any) {
      const message = err.message || "Failed to fetch user";
      if (message === "token expired") {
        await logout();
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { userMe, loading, error, refetch: fetchUser };
}
