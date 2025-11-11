import type { ContractorAction } from "~/lib/voice-actions";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { z } from "zod/v4";

export const voiceRouter = createTRPCRouter({
  determineIntent: protectedProcedure
    .input(
      z.object({
        audioBase64: z.string(),
        mimeType: z.string().default("audio/webm"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // const text = await voiceToText(input.audioBase64, input.mimeType);
      // const intent = await determineIntent(result.text);

      return {
        text: "Add a hello section to the proposal description",
        intent: "edit-proposal-description" as ContractorAction,
      };
    }),
});
