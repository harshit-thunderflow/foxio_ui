import { useState, useEffect, useCallback, useRef } from "react";
import { fetchProfileApi, type UserProfile } from "@/services/profile";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoutRef = useRef(logout);
  const loggingOut = useRef(false);
  logoutRef.current = logout;

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfileApi();
      setProfile(data);
    } catch (err: any) {
      const message = err.message || "Failed to fetch profile";
      if (message === "token expired" && !loggingOut.current) {
        loggingOut.current = true;
        await logoutRef.current();
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
