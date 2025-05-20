/**
 * Mock Auth Context for development
 */
import React, { createContext, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  error: string | null;
  isLoading: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const mockUser: User = {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    role: "admin",
    permissions: ["analytics:export", "analytics:view"],
  };

  const value: AuthContextType = {
    user: mockUser,
    isAuthenticated: true,
    loading: false,
    login: async () => {},
    logout: () => {},
    register: async () => {},
    signup: async () => {},
    error: null,
    isLoading: false,
    clearError: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a MockAuthProvider");
  }
  return context;
};

export const AuthProvider = MockAuthProvider;
