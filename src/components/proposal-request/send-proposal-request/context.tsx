"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CreateProposalRequestSchema } from "~/server/api/schema/proposal-request-schema";
import type { Project } from "~/server/data-access/project/project";

interface ProposalRequestActions {
  submit: (data: CreateProposalRequestSchema) => Promise<void>;
}

interface ProposalRequestContextType {
  project: Project;
  actions: ProposalRequestActions;
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
  actions: ProposalRequestActions;
  children: ReactNode;
}

export const Provider = ({
  project,
  actions,
  children,
}: ProposalRequestProviderProps) => {
  return (
    <ProposalRequestContext.Provider
      value={{
        project,
        actions,
      }}
    >
      {children}
    </ProposalRequestContext.Provider>
  );
};
