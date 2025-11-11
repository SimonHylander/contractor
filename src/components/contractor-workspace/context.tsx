"use client";

import { createContext, useContext, type ReactNode } from "react";

interface ContractorAreaActions {
  setContent: (content?: ContentType) => void;
}

interface ContractorAreaContextType {
  userId: string;
  content?: ContentType;
  actions: ContractorAreaActions;
}

const ContractorAreaContext = createContext<
  ContractorAreaContextType | undefined
>(undefined);

export const useComposer = () => {
  const context = useContext(ContractorAreaContext);
  if (!context) {
    throw new Error("useComposer must be used within ContractorAreaProvider");
  }
  return context;
};

export interface ContentType {
  id?: string;
  type: "proposal-request" | "proposal";
}

export interface ContractorAreaProviderProps {
  content?: ContentType;
  userId: string;
  actions: ContractorAreaActions;
  children: ReactNode;
}

export const Provider = ({
  userId,
  content,
  actions,
  children,
}: ContractorAreaProviderProps) => {
  return (
    <ContractorAreaContext.Provider
      value={{
        userId,
        content,
        actions,
      }}
    >
      {children}
    </ContractorAreaContext.Provider>
  );
};
