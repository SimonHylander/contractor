import { env } from "~/env";
import { CONSTANTS } from "../constants";
import type {
  RfpSchema,
  CreateProposalSchema,
  PatchProposalDataSchema,
  ProposalSearchParams,
  ProposalDataResponse,
  CreateProposalResponse,
  ProposalSearchResponse,
} from "./types";
import { headers } from "../headers";

const { baseUrl } = CONSTANTS;

export const proposalAPI = {
  /**
   * Gets a proposal by UUID
   * @param uuid - The UUID of the proposal
   * @returns Promise with proposal data
   */
  getProposal: async (uuid: string): Promise<ProposalDataResponse> => {
    const response = await fetch(`${baseUrl}/v3/proposals/${uuid}`, {
      headers: {
        ...headers(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get proposal: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return await response.json();
  },

  /**
   * Creates a new proposal
   * @param input - Proposal data to create
   * @returns Promise with created proposal response
   */
  createProposal: async (
    input: CreateProposalSchema,
  ): Promise<CreateProposalResponse> => {
    console.log(input);
    const response = await fetch(`${baseUrl}/v3/proposals`, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create proposal: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return await response.json();
  },

  /**
   * Patches proposal data (partial update)
   * @param uuid - The UUID of the proposal to update
   * @param input - Partial proposal data to update
   * @returns Promise with updated proposal data
   */
  patchProposalData: async (uuid: string, input: PatchProposalDataSchema) => {
    const url = `${baseUrl}/v3/proposals/${uuid}`;

    const response = await fetch(`${baseUrl}/v3/proposals/${uuid}`, {
      method: "PATCH",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    console.log(`${response.status} PATCH ${url}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to patch proposal: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }
  },

  /**
   * Searches for proposals based on filters
   * @param params - Search parameters and filters
   * @returns Promise with search results
   */
  searchProposals: async (
    params?: ProposalSearchParams,
  ): Promise<ProposalSearchResponse> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${baseUrl}/v3/proposal-search${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      headers: {
        ...headers(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to search proposals: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return await response.json();
  },

  /**
   * Creates an RFP (Request for Proposal)
   * Note: This uses v1 endpoint as per Proposales API documentation
   * @param input - RFP data
   * @returns Promise that resolves when RFP is sent
   */
  rfp: async (input: RfpSchema): Promise<void> => {
    const token = env.PROPOSALES_API_KEY;

    const response = await fetch(`${baseUrl}/v1/inbox/${token}`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to send RFP: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    // RFP endpoint may not return data, so we don't parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      await response.json();
    }
  },
};
