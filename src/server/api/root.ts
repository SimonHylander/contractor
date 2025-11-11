import { contractorRouter } from "~/server/api/routers/contractor-router";
import { proposalRequestRouter } from "~/server/api/routers/proposal-request-router";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth-router";
import { proposalRouter } from "./routers/proposal-router";
import { contentRouter } from "./routers/content-router";
import { voiceRouter } from "./routers/voice-router";
import { projectRouter } from "./routers/project-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  contractor: contractorRouter,
  project: projectRouter,
  proposalRequest: proposalRequestRouter,
  proposal: proposalRouter,
  content: contentRouter,
  voice: voiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
