import { env } from "~/env";
import type { CreateProposalSchema } from "~/server/api/schema/create-proposal-schema";
import { ProposalesClient } from "../proposales/client";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import type { Recipient } from "../proposales/proposal/types";
import { getUserById } from "../user";

export async function getProposals(userId: string) {
  return await db
    .select()
    .from(schema.proposals)
    .where(eq(schema.proposals.userId, userId));
}

export async function getProposalById(id: string) {
  const proposal = await db
    .select()
    .from(schema.proposals)
    .where(eq(schema.proposals.id, id))
    .then(([proposal]) => proposal);

  return proposal;
}

export async function createProposal(
  input: CreateProposalSchema,
  proposalRequest: schema.ProposalRequest,
  userId: string,
) {
  const user = await getUserById(userId);
  const recipientUser = await getUserById(proposalRequest.userId);

  const recipient: Recipient | undefined = recipientUser
    ? {
        email: recipientUser.email,
        first_name: recipientUser.name,
        last_name: recipientUser.name,
      }
    : undefined;

  const proposal = await ProposalesClient.proposals.createProposal({
    company_id: env.PROPOSALES_COMPANY_ID,
    language: "en",
    contact_email: user.email,
    title_md: input.title,
    description_md: input.description,
    recipient,
    data: {
      foo: "bar",
    },
    blocks: [
      {
        content_id: input.productId,
        type: "product-block",
      },
    ],
  });

  /* await ProposalesClient.proposals.patchProposalData(proposal.proposal.uuid, {
    company_id: env.PROPOSALES_COMPANY_ID,
    status: "active",
  }); */

  await db.insert(schema.proposals).values({
    id: proposal.proposal.uuid,
    userId: userId,
    url: proposal.proposal.url,
    title: input.title,
  });
}
