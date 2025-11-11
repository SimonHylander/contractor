import { generateObject, generateText, streamText } from "ai";
import { z } from "zod/v4";
import { streamToAsyncIterable } from "~/lib/stream";

import type { Project } from "~/server/data-access/project/project";

const outputSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      information: z.string(),
    }),
  ),
});

export async function editOutline(description: string, intentText: string) {
  const prompt = buildPrompt(description, intentText);
  console.log(prompt);

  const { textStream } = await streamText({
    model: "gpt-5-nano",
    prompt,
    temperature: 0.1,
  });

  return textStream;
}

function buildPrompt(description: string, intentText: string) {
  return `
    You are a construction proposal request assistant.
    The user has provided an instruction to update the existing proposal request description.
    Apply only the requested changes from the instruction while keeping the rest of the description coherent.
    Output ONLY the revised proposal request message text. Do not include headings or meta commentary.

    Existing description:
    ${description}

    User Instruction:
    ${intentText}
  `;
}
