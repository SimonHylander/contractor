"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CreateProposalRequestSchema } from "~/server/api/schema/proposal-request-schema";
import type { Project } from "~/server/data-access/project/project";

interface ProposalRequestActions {
  toggleGenerating: () => void;
  updateDescription: (chunk: string) => void;
  resetDescription: () => void;
  submit: (data: CreateProposalRequestSchema) => Promise<void>;
}

interface ProposalRequestContextType {
  project: Project;
  isGenerating: boolean;
  actions: ProposalRequestActions;
  accumulatedDescription: string;
}

const ProposalRequestContext = createContext<
  ProposalRequestContextType | undefined
>(undefined);

export const useComposer = () => {
  const context = useContext(ProposalRequestContext);
  if (!context) {
    throw new Error(
      "useProposalRequest must be used within ProposalRequestProvider",
    );
  }
  return context;
};

export interface ProposalRequestProviderProps {
  project: Project;
  isGenerating: boolean;
  accumulatedDescription: string;
  actions: ProposalRequestActions;
  children: ReactNode;
}

export const Provider = ({
  project,
  isGenerating,
  accumulatedDescription,
  actions,
  children,
}: ProposalRequestProviderProps) => {
  return (
    <ProposalRequestContext.Provider
      value={{
        project,
        isGenerating,
        accumulatedDescription,
        actions,
      }}
    >
      {children}
    </ProposalRequestContext.Provider>
  );
};
