import { useCallback } from "react";
import { authFetch } from "@/services/authFetch";

/**
 * Hook that returns the authenticated fetch function.
 * Automatically handles token refresh on 401 responses.
 */
export function useAuthFetch() {
  const fetchWithAuth = useCallback(
    (input: string, init?: RequestInit) => authFetch(input, init),
    []
  );

  return fetchWithAuth;
}
