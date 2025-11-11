"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CreateProposalRequestSchema } from "~/server/api/schema/proposal-request-schema";
import { api } from "~/trpc/react";

export function useSendProposalRequest({ projectId }: { projectId: string }) {
  const router = useRouter();

  const createProposalRequest = api.proposalRequest.create.useMutation({
    onSuccess: () => {
      toast.success("Proposal request sent successfully");
      router.push(`/projects/${projectId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (data: CreateProposalRequestSchema) => {
    return createProposalRequest.mutateAsync(data);
  };
}
