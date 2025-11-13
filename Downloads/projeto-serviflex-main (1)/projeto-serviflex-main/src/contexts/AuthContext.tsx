import React, { createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: User | null;
  userData: unknown;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isClient: boolean;
  isProfessional: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuthContext foi chamado fora do AuthProvider");
    // Retornar valores padrão em vez de lançar erro
    return {
      user: null,
      userData: null,
      loading: false,
      error: "AuthContext não disponível",
      isAuthenticated: false,
      isClient: false,
      isProfessional: false,
      refreshUserData: async () => {}
    };
  }
  return context;
}
