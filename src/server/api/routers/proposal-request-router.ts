import { tracked, TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { getProject } from "~/server/data-access/project/project";
import { classifyProposalRequest } from "~/server/data-access/proposal-request/classify";
import { generateOutline } from "~/server/data-access/proposal-request/generate-outline";
import { editOutline } from "~/server/data-access/proposal-request/edit-outline";
import {
  createProposalRequest,
  getProposalRequestById,
  saveClassification,
} from "~/server/data-access/proposal-request/proposal-request";
import { createProposalRequestSchema } from "../schema/proposal-request-schema";

export const proposalRequestRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getProposalRequestById(input.id);
    }),

  generateOutline: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        lastEventId: z.string().nullish(),
      }),
    )
    .subscription(async function* ({ input, signal }) {
      if (!signal) {
        throw new Error("Signal is required for subscription");
      }

      signal.addEventListener("abort", () => {});

      let lastEventId = input?.lastEventId ?? null;
      const projectId = input?.projectId ?? null;
      const project = await getProject(projectId);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const stream = await generateOutline(project);

      for await (const chunk of stream) {
        console.log(chunk);
        yield tracked("chunk", chunk);
      }
    }),

  generateOutlineForIntent: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        outline: z.string(),
        userInstruction: z.string(),
        lastEventId: z.string().nullish(),
      }),
    )
    .subscription(async function* ({ input, signal }) {
      if (!signal) {
        throw new Error("Signal is required for subscription");
      }

      signal.addEventListener("abort", () => {});

      let lastEventId = input?.lastEventId ?? null;
      const projectId = input?.projectId ?? null;
      const project = await getProject(projectId);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      console.log("input", input.outline);

      const stream = await editOutline(input.outline, input.userInstruction);

      for await (const chunk of stream) {
        console.log(chunk);
        yield tracked("chunk", chunk);
      }
    }),
  create: protectedProcedure
    .input(createProposalRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      const proposalRequest = await createProposalRequest({
        userId,
        projectId: input.projectId,
        description: input.description,
        email: input.email,
      });

      if (!proposalRequest) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create proposal request",
        });
      }

      const classification = await classifyProposalRequest(proposalRequest);

      await saveClassification(proposalRequest.id, classification);
    }),
});
