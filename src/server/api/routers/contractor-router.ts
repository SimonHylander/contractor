import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUsers } from "~/server/data-access/user";

export const contractorRouter = createTRPCRouter({
  getAvailableContractors: protectedProcedure.query(async ({ ctx }) => {
    const allUsers = await getUsers();
    const currentUser = ctx.session.user;

    return allUsers.filter((user) => user.id !== currentUser.id);
  }),
});
