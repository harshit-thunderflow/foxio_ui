const TOKEN_KEY = "foxio-auth-token";
const USER_KEY = "foxio-auth-user";

export interface AuthUser {
  user_id: string;
  email: string;
}

export const tokenStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setUser: (user: AuthUser) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};
