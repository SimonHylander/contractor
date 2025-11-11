import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ProposalesClient } from "~/server/data-access/proposales/client";

export const contentRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    const content = await ProposalesClient.content.listContent();

    return content.data.map((item) => ({
      ...item,
      title: item.title.en,
    }));
  }),
});
