import { z } from "zod/v4";

export const createProposalRequestSchema = z.object({
  projectId: z.string().min(1),
  description: z.string().min(1),
  email: z.email(),
});

export type CreateProposalRequestSchema = z.infer<
  typeof createProposalRequestSchema
>;
