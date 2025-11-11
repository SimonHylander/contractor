"use client";

import { useRouter } from "next/navigation";

import { createContext, useContext, type ReactNode } from "react";

import type { User } from "~/server/data-access/user";
import { api } from "~/trpc/react";

export type UserRole = "client" | "main_contractor" | "subcontractor";

interface AuthContextType {
  user: User | null;
  signIn: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: currentUser = null } = api.auth.me.useQuery();

  const router = useRouter();

  const signIn = (userId: string) => {
    router.push(`/api/auth/set-cookie?userId=${userId}`);
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
