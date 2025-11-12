import { z } from "zod/v4";

export const voiceActions = {
  client: ["edit-proposal-request-description"],
  contractor: ["create-proposal", "generate-proposal-outline"],
};

export const contractorActionsSchema = z
  .enum([
    "create-proposal",
    "generate-proposal-outline",
    "edit-proposal-description",
  ])
  .nullable()
  .describe(
    "The action that matches the user's intent, or null if no action matches",
  );

export type ContractorAction = z.infer<typeof contractorActionsSchema>;

export const voiceActionsSchema = z.object({
  contractor: contractorActionsSchema,
});
