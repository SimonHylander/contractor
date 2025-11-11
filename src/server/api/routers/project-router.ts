import { z } from "zod/v4";
import { getProject } from "~/server/data-access/project/project";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getProject(input.projectId);
    }),
});
