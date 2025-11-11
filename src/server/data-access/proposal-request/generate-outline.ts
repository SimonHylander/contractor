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

export async function generateOutline(project: Project) {
  const prompt = buildPrompt(project);

  const { textStream } = await streamText({
    // model: "gpt-5-mini",
    model: "gpt-5-nano",
    prompt,
    temperature: 0.1,
  });

  return textStream;
}

function buildPrompt(project: Project) {
  const description = project.sections
    .map((section) => section.description)
    .join("\n");

  return `
    You are a construction proposal request assistant.
    Generate a short, polite proposal request message that can be sent to a contractor.
    The tone should be professional but casual and easy to read.
    Do not include long instructions or formal sections — just a simple project request summarizing what’s needed, the timeframe, and the main tasks.
    Don't ask any follow up questions, just generate the proposal request message.

    Project:
    ${project.name}
    ${project.startDate} - ${project.endDate}
    ${project.progress}% complete
    ${project.value} value

    Sections:
    ${description}
  `;
}
