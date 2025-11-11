import { tracked, TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getProposalRequestById } from "~/server/data-access/proposal-request/proposal-request";
import { generateProposalDescription } from "~/server/data-access/proposal/generate-description";
import {
  createProposal,
  getProposalById,
} from "~/server/data-access/proposal/proposal";
import { createProposalSchema } from "../schema/create-proposal-schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const proposalRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getProposalById(input.id);
    }),
  generateOutline: protectedProcedure
    .input(
      z.object({
        proposalRequestId: z.string(),
        lastEventId: z.string().nullish(),
      }),
    )
    .subscription(async function* ({ input, signal }) {
      console.log(input);

      if (!signal) {
        throw new Error("Signal is required for subscription");
      }

      signal.addEventListener("abort", () => {});

      let lastEventId = input?.lastEventId ?? null;
      const proposalRequestId = input?.proposalRequestId ?? null;
      const proposalRequest = await getProposalRequestById(proposalRequestId);

      if (!proposalRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal request not found",
        });
      }

      const stream = await generateProposalDescription(proposalRequest);

      for await (const chunk of stream) {
        yield tracked("chunk", chunk);
      }
    }),
  create: protectedProcedure
    .input(createProposalSchema)
    .mutation(async ({ input, ctx }) => {
      const proposalRequest = await getProposalRequestById(
        input.proposalRequestId,
      );

      if (!proposalRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal request not found",
        });
      }

      await createProposal(input, proposalRequest, ctx.session?.user?.id);
    }),
});
