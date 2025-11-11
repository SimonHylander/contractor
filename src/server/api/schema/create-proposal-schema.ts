import { z } from "zod/v4";

export const createProposalSchema = z.object({
  proposalRequestId: z.uuid(),
  productId: z.number(),
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(40, "Title must be less than 40 characters"),
  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  /* scope: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string(),
    cost: z.string(),
    paymentTerms: z.string(), */
});

export type CreateProposalSchema = z.infer<typeof createProposalSchema>;
