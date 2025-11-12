"use client";

import { toast } from "sonner";
import type { CreateProposalRequestSchema } from "~/server/api/schema/proposal-request-schema";
import { api } from "~/trpc/react";

export function useSendProposalRequest({ projectId }: { projectId: string }) {
  const createProposalRequest = api.proposalRequest.create.useMutation({
    onSuccess: () => {
      toast.success("Proposal request sent successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (data: CreateProposalRequestSchema) => {
    return createProposalRequest.mutateAsync(data);
  };
}
