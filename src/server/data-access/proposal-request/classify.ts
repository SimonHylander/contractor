import { generateObject } from "ai";
import { z } from "zod/v4";

import type { Project } from "~/server/data-access/project/project";
import type { ProposalRequest } from "~/server/db/schema";
import { getUsers } from "../user";
import { getProject } from "../project/project";

/**
 * Schema for the specialty match classification output
 */
const specialtyMatchSchema = z.object({
  specialty: z.string().describe("The specialty that was analyzed"),
  matches: z
    .boolean()
    .describe("Whether this specialty matches the proposal request"),
  confidence: z.number().min(0).max(1).describe("Confidence score from 0 to 1"),
});

const classificationOutputSchema = z.array(specialtyMatchSchema);

export type SpecialtyMatch = z.infer<typeof specialtyMatchSchema>;
export type ClassificationResult = z.infer<typeof classificationOutputSchema>;

/**
 * Classifies a proposal request to determine which user specialties it matches.
 * Uses AI to analyze the proposal description and project details against available specialties.
 *
 * @param proposalRequest - The proposal request to classify
 * @returns Classification results with matched specialties, confidence scores, and reasoning
 */
export async function classifyProposalRequest(
  proposalRequest: ProposalRequest,
): Promise<ClassificationResult> {
  // Get all users to extract unique specialties
  const users = await getUsers();
  const allSpecialties = Array.from(
    new Set(users.flatMap((user) => user.specialties)),
  ).filter((specialty) => specialty.length > 0);

  if (allSpecialties.length === 0) {
    return [];
  }

  // Get project details if available
  const project = proposalRequest.projectId
    ? (getProject(proposalRequest.projectId) ?? null)
    : null;

  const prompt = buildClassificationPrompt(
    proposalRequest,
    project,
    allSpecialties,
  );

  const { object } = await generateObject({
    model: "gpt-4o-mini",
    output: "array",
    schema: specialtyMatchSchema,
    prompt,
  });

  return object;
}

/**
 * Gets contractors whose specialties match the proposal request.
 *
 * @param proposalRequest - The proposal request to match
 * @param minConfidence - Minimum confidence threshold (0-1) for considering a match
 * @returns List of contractors with matching specialties and their confidence scores
 */
export async function getMatchingContractors(
  proposalRequest: ProposalRequest,
  minConfidence: number = 0.6,
) {
  const classification = await classifyProposalRequest(proposalRequest);
  const users = await getUsers();

  // Filter for matches above the confidence threshold
  const matchedSpecialties = classification
    .filter((match) => match.matches && match.confidence >= minConfidence)
    .map((match) => match.specialty.toLowerCase());

  if (matchedSpecialties.length === 0) {
    return [];
  }

  const matchingContractors = users
    .filter((user) => user.role === "contractor")
    .map((contractor) => {
      const contractorSpecialties = contractor.specialties.map((s) =>
        s.toLowerCase(),
      );

      // matching specialties
      const matches = classification.filter(
        (match) =>
          match.matches &&
          match.confidence >= minConfidence &&
          contractorSpecialties.includes(match.specialty.toLowerCase()),
      );

      if (matches.length === 0) {
        return null;
      }

      // Average confidence for contractor
      const avgConfidence =
        matches.reduce((sum, match) => sum + match.confidence, 0) /
        matches.length;

      return {
        contractor,
        matchedSpecialties: matches,
        averageConfidence: avgConfidence,
      };
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)
    .sort((a, b) => b.averageConfidence - a.averageConfidence);

  return matchingContractors;
}

function buildClassificationPrompt(
  proposalRequest: ProposalRequest,
  project: Project | null,
  specialties: string[],
): string {
  return `You are a construction industry expert specializing in matching contractor specialties to project requirements.

Analyze the following proposal request and determine which contractor specialties are needed.

PROPOSAL REQUEST:
${proposalRequest.description || "No description provided"}

PROJECT INFORMATION:
${project ? buildProjectInfo(project) : "No project information provided"}

AVAILABLE SPECIALTIES:
${specialties.map((s) => `- ${s}`).join("\n")}

For each specialty, determine:
1. Whether it matches the proposal request requirements (true/false)
2. Confidence score (0.0 to 1.0) - how confident you are in this match

Consider:
- Explicit mentions of the specialty or related work
- Implicit requirements that would need this specialty
- Project scope and complexity
- Related or complementary specialties that might be needed
- Industry standards and typical project requirements

Be conservative with matches - only mark as matching if there's clear evidence the specialty is needed.
Use confidence scores to indicate strength of the match (e.g., 0.9+ for explicit mentions, 0.6-0.8 for implicit needs).`;
}

function buildProjectInfo(project: Project) {
  const sections = project?.sections
    .map((s) => `- ${s.name}: ${s.description}`)
    .join("\n");

  const projectInfo = `
Project Name: ${project.name}
Project Status: ${project.status}
Project Timeline: ${project.startDate} to ${project.endDate}
Project Sections:
${sections}`;

  return projectInfo;
}
