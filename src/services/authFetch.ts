import { API_BASE_URL } from "./api";
import { tokenStorage } from "./token";
import { refreshTokenApi } from "./auth";

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await refreshTokenApi(refreshToken);
    tokenStorage.setToken(res.access_token);
    tokenStorage.setRefreshToken(res.refresh_token);
    tokenStorage.setUser({ user_id: res.user_id, email: res.email });
    return true;
  } catch {
    tokenStorage.clear();
    return false;
  }
}

/**
 * Authenticated fetch that auto-refreshes on 401.
 * If refresh fails, dispatches a "foxio:session-expired" event.
 */
export async function authFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = input.startsWith("http") ? input : `${API_BASE_URL}${input}`;

  const makeRequest = () => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${tokenStorage.getToken()}`,
      ...(init.headers as Record<string, string>),
    };
    // Only set Content-Type if not FormData (browser sets it with boundary)
    if (!(init.body instanceof FormData)) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }
    return fetch(url, {
      ...init,
      headers,
    });
  };

  const res = await makeRequest();

  if (res.status !== 401) return res;

  // Deduplicate concurrent refresh calls
  if (!refreshPromise) {
    refreshPromise = tryRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;

  if (refreshed) return makeRequest();

  window.dispatchEvent(new CustomEvent("foxio:session-expired"));
  throw new Error("Session expired");
}
