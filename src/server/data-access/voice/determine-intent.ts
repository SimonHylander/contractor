import { contractorActionsSchema, voiceActions } from "~/lib/voice-actions";

import { generateObject } from "ai";

export async function determineIntent(text: string) {
  const actions = voiceActions.contractor;

  const { object } = await generateObject({
    model: "gpt-5-mini",
    // model: "gemini-2.5-flash",
    output: "enum",
    enum: actions,
    prompt: text,
    // schema: contractorActionsSchema,
    system:
      `You are an intent classifier. Analyze the user's text and determine if it matches one of these actions: ${actions.join(", ")}.` +
      `Only return an action if the user's intent clearly matches one of these specific actions. If the text does not relate to any of these actions, return null for the action field.`,
    temperature: 0.1,
  });

  return object;
}
