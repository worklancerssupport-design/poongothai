import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const USERNAME = import.meta.env.VITE_EDIT_USERNAME;
const PASSWORD = import.meta.env.VITE_EDIT_PASSWORD;

interface AuthCtx {
  isAuthenticated: boolean;
  error: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((username: string, password: string) => {
    if (username === USERNAME && password === PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
      return true;
    }
    setError("Invalid username or password");
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
