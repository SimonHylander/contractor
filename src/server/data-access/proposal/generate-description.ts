import { streamText } from "ai";

import type { ProposalRequest } from "~/server/db/schema";

export async function generateProposalDescription(
  proposalRequest: ProposalRequest,
) {
  const prompt = buildPrompt(proposalRequest);

  const { textStream } = await streamText({
    model: "gemini-2.5-flash",
    prompt,
    temperature: 0.3,
  });

  return textStream;
}

function buildPrompt(proposalRequest: ProposalRequest) {
  return `
    You are a construction proposal assistant for contractors.
    Generate a short, polite proposal message in response to the below request that can be sent to a client.
    The tone should be professional but casual and easy to read.
    Do not include long instructions or formal sections — just a simple project request summarizing what’s needed, the timeframe, and the main tasks.
    Don't ask any follow up questions, just generate the proposal request message.
    Skip any introductions and goodbyes, just generate the proposal request message.

    Proposal Request:
    ${proposalRequest.description}
  `;
}
