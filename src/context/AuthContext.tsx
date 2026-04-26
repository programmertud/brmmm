// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";

interface User {
  username: string;
  role: "admin" | "secretary" | "captain";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // ← This prevents flash of login page
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ← Starts as true

  // Restore login from localStorage when app starts
  useEffect(() => {
    const loadSavedUser = () => {
      try {
        const saved = localStorage.getItem("barangay_user");

        if (saved && saved !== "null" && saved !== "undefined") {
          const parsed = JSON.parse(saved);
          if (parsed?.username && parsed?.role) {
            setUser(parsed as User);
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("barangay_user");
      } finally {
        // ← This line is REQUIRED — tells app: "I'm done checking"
        setIsLoading(false);
      }
    };

    loadSavedUser();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post("/auth/login", { username, password });

      const safeUser: User = {
        username: response.data.username,
        role: response.data.role,
      };

      setUser(safeUser);
      localStorage.setItem("barangay_user", JSON.stringify(safeUser));
      return { success: true };
    } catch (error: any) {
      console.error("Login failed", error);
      const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Login failed";
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("barangay_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading, // ← Now exposed to App.tsx
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};