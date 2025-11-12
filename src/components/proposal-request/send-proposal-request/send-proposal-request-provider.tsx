"use client";

import { useState } from "react";
import { useSendProposalRequest } from "~/hooks/use-send-proposal-request";
import type { Project } from "~/server/data-access/project/project";
import { Composer } from "./composer";

export function SendProposalRequestProvider({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const sendProposalRequest = useSendProposalRequest({
    projectId: project.id,
  });

  return (
    <Composer.Provider
      project={project}
      actions={{
        submit: sendProposalRequest,
      }}
    >
      {children}
    </Composer.Provider>
  );
}
