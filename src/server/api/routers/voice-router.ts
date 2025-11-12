import type { ContractorAction } from "~/lib/voice-actions";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { z } from "zod/v4";
import { voiceToText } from "~/server/data-access/voice/voice-to-text";
import { determineIntent } from "~/server/data-access/voice/determine-intent";

export const voiceRouter = createTRPCRouter({
  determineIntent: protectedProcedure
    .input(
      z.object({
        audioBase64: z.string(),
        mimeType: z.string().default("audio/webm"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const text = await voiceToText(input.audioBase64, input.mimeType);
      console.log("voiceToText:", text);
      const intent = await determineIntent(text);

      return {
        text,
        intent,
      };

      /* return {
        text: "Add a hello and goodbye section for the proposal description",
        intent: "edit-proposal-description" as ContractorAction,
      }; */
    }),
});
