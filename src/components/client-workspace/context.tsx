"use client";

import { createContext, useContext, type ReactNode } from "react";

interface ClientAreaActions {
  setContent: (content?: ContentType) => void;
}

interface ClientAreaContextType {
  userId: string;
  content?: ContentType;
  actions: ClientAreaActions;
}

const ClientAreaContext = createContext<ClientAreaContextType | undefined>(
  undefined,
);

export const useComposer = () => {
  const context = useContext(ClientAreaContext);
  if (!context) {
    throw new Error("useComposer must be used within ClientAreaProvider");
  }
  return context;
};

export interface ContentType {
  id?: string;
  type: "project";
}

export interface ClientAreaProviderProps {
  content?: ContentType;
  userId: string;
  actions: ClientAreaActions;
  children: ReactNode;
}

export const Provider = ({
  userId,
  content,
  actions,
  children,
}: ClientAreaProviderProps) => {
  return (
    <ClientAreaContext.Provider
      value={{
        userId,
        content,
        actions,
      }}
    >
      {children}
    </ClientAreaContext.Provider>
  );
};
