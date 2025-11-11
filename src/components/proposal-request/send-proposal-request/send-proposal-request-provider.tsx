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
  const [isGenerating, setIsGenerating] = useState(false);
  const [accumulatedDescription, setAccumulatedDescription] = useState("");

  const sendProposalRequest = useSendProposalRequest({
    projectId: project.id,
  });

  return (
    <Composer.Provider
      project={project}
      isGenerating={isGenerating}
      accumulatedDescription={accumulatedDescription}
      actions={{
        toggleGenerating: () => setIsGenerating((generating) => !generating),
        updateDescription: (chunk: string) => {
          setAccumulatedDescription((prev) => prev + chunk);
        },
        resetDescription: () => {
          setAccumulatedDescription("");
        },
        submit: sendProposalRequest,
      }}
    >
      {children}
    </Composer.Provider>
  );
}
