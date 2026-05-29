import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { tokenStorage, type AuthUser } from "@/services/token";
import { loginApi, logoutApi } from "@/services/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: async () => {},
  loading: false,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(tokenStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(tokenStorage.isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(tokenStorage.isAuthenticated());
    setUser(tokenStorage.getUser());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi({ email, password });
      tokenStorage.setToken(res.access_token);
      tokenStorage.setUser({ user_id: res.user_id, email: res.email });
      setUser({ user_id: res.user_id, email: res.email });
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // proceed with local logout even if API fails
    }
    tokenStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
