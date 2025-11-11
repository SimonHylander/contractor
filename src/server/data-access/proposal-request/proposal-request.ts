import { and, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "~/server/db";

import * as schema from "~/server/db/schema";
import { getUsers } from "../user";
import { getProject } from "../project/project";
import type { ClassificationResult, SpecialtyMatch } from "./classify";

export async function getPublishedProposalRequests(
  userId: string,
  projectId: string,
) {
  return await db
    .select()
    .from(schema.proposalRequests)
    .where(
      and(
        eq(schema.proposalRequests.projectId, projectId),
        eq(schema.proposalRequests.userId, userId),
      ),
    );
}

export async function getReceivedProposalRequests(
  targetUserId: string,
): Promise<
  Array<{
    id: string;
    userId: string;
    projectId: string;
    email: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    project?: {
      id: string;
      name: string;
      status: string;
      contracts: number;
      value: string;
      progress: number;
      ownerId: string;
      startDate: string;
      endDate: string;
      sections: Array<{
        name: string;
        description: string;
      }>;
    };
  }>
> {
  /* const proposalRequests = await db
    .select()
    .from(schema.proposalRequests)
    .where(and(eq(schema.proposalRequests.targetUserId, targetUserId)));

  const projects = getProjects();
  const projectMap = new Map(projects.map((project) => [project.id, project]));

  return proposalRequests.map((proposalRequest) => {
    const project = projectMap.get(proposalRequest.projectId);

    return {
      ...proposalRequest,
      project,
    };
  }); */

  return [];
}

export type ReceivedProposalRequest = Awaited<
  ReturnType<typeof getReceivedProposalRequests>
>[number];

export async function getMatchingProposalRequests(userId: string) {
  // Get the user to access their specialties
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user || user.specialties.length === 0) {
    return [];
  }

  // Normalize user specialties to lowercase for case-insensitive matching
  const normalizedSpecialties = user.specialties.map((s) => s.toLowerCase());

  // Query JSONB column to find proposals where:
  // 1. Classification exists
  // 2. Any element in the classification array has matches=true AND specialty matches user's specialties
  const proposalRequests = await db
    .select()
    .from(schema.proposalRequests)
    .where(
      sql`EXISTS (
        SELECT 1 
        FROM jsonb_array_elements(${schema.proposalRequests.classification}::jsonb) AS match
        WHERE (match->>'matches')::boolean = true
        AND LOWER(match->>'specialty') IN (${sql.join(
          normalizedSpecialties.map((s) => sql`${s}`),
          sql`, `,
        )})
      )`,
    );

  // Filter and enrich proposal requests with matching projects and classification data
  const matchingProposals = proposalRequests
    .map((proposalRequest) => {
      const project = getProject(proposalRequest.projectId);

      if (!project) {
        return null;
      }

      // Extract matching specialties from the classification
      const classification = proposalRequest.classification as
        | ClassificationResult
        | null
        | undefined;
      const matchedSpecialties =
        classification?.filter(
          (match: SpecialtyMatch) =>
            match.matches &&
            normalizedSpecialties.includes(match.specialty.toLowerCase()),
        ) ?? [];

      if (matchedSpecialties.length === 0) {
        return null;
      }

      return {
        ...proposalRequest,
        project,
        matchedSpecialties,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return matchingProposals;
}

export type MatchingProposalRequest = Awaited<
  ReturnType<typeof getMatchingProposalRequests>
>[number];

export async function getProposalRequestById(proposalRequestId: string) {
  const proposalRequest = await db
    .select()
    .from(schema.proposalRequests)
    .where(eq(schema.proposalRequests.id, proposalRequestId))
    .then(([proposalRequest]) => proposalRequest);

  if (!proposalRequest) {
    return null;
  }

  const project = getProject(proposalRequest.projectId);

  return {
    ...proposalRequest,
    project,
  };
}

export const proposalRequestSchema = z.object({
  userId: z.uuidv7(),
  projectId: z.uuidv7(),
  description: z.string(),
  email: z.email(),
});

type ProposalRequestSchema = z.infer<typeof proposalRequestSchema>;

export async function createProposalRequest(input: ProposalRequestSchema) {
  const created = await db
    .insert(schema.proposalRequests)
    .values(input)
    .returning()
    .then(([proposalRequest]) => proposalRequest);

  return created;
}

export async function saveClassification(
  proposalRequestId: string,
  classification: ClassificationResult,
) {
  const updated = await db
    .update(schema.proposalRequests)
    .set({ classification })
    .where(eq(schema.proposalRequests.id, proposalRequestId))
    .returning()
    .then(([proposalRequest]) => proposalRequest);

  return updated;
}

export function toDTO(proposalRequest: schema.ProposalRequest) {
  return {
    id: proposalRequest.id,
    userId: proposalRequest.userId,
    projectId: proposalRequest.projectId,
    email: proposalRequest.email,
    description: proposalRequest.description,
    classification: proposalRequest.classification,
  };
}

export type ProposalRequestDTO = ReturnType<typeof toDTO>;
