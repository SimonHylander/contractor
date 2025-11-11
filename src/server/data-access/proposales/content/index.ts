import { CONSTANTS } from "../constants";
import { headers } from "../headers";

import type {
  ContentListParams,
  CreateContentSchema,
  UpdateContentSchema,
  BulkArchiveContentSchema,
  BulkRestoreContentSchema,
  ContentResponse,
  ContentListResponse,
} from "./types";

const { baseUrl } = CONSTANTS;

export const contentAPI = {
  /**
   * Lists all content items
   * @param params - Optional query parameters for filtering
   * @returns Promise with content list response
   */
  listContent: async (
    params?: ContentListParams,
  ): Promise<ContentListResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.variation_id) {
      searchParams.append("variation_id", params.variation_id);
    }
    if (params?.product_id) {
      searchParams.append("product_id", params.product_id);
    }
    if (params?.include_archived !== undefined) {
      searchParams.append(
        "include_archived",
        params.include_archived.toString(),
      );
    }
    if (params?.include_sources !== undefined) {
      searchParams.append("include_sources", params.include_sources.toString());
    }

    const url = `${baseUrl}/v3/content${
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
        `Failed to list content: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return await response.json();
  },

  /**
   * Creates a new content item
   * @param input - Content data to create
   * @returns Promise with created content response
   */
  createContent: async (
    input: CreateContentSchema,
  ): Promise<ContentResponse> => {
    const response = await fetch(`${baseUrl}/v3/content`, {
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
        `Failed to create content: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return await response.json();
  },

  /**
   * Updates an existing content item
   * @param variationId - Variation ID of the content to update
   * @param input - Content data to update
   * @returns Promise with updated content response
   */
  updateContent: async (
    variationId: number,
    input: UpdateContentSchema,
  ): Promise<ContentResponse> => {
    const response = await fetch(`${baseUrl}/v3/content/${variationId}`, {
      method: "PUT",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update content: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return await response.json();
  },

  /**
   * Deletes a content item
   * @param variationId - Variation ID of the content to delete
   * @returns Promise that resolves when deletion is successful
   */
  deleteContent: async (variationId: number): Promise<void> => {
    const response = await fetch(`${baseUrl}/v3/content/${variationId}`, {
      method: "DELETE",
      headers: {
        ...headers(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete content: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }
  },

  /**
   * Archives multiple content items
   * @param input - Object containing variation IDs to archive
   * @returns Promise that resolves when archiving is successful
   */
  bulkArchiveContent: async (
    input: BulkArchiveContentSchema,
  ): Promise<void> => {
    const response = await fetch(`${baseUrl}/v3/content`, {
      method: "DELETE",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to bulk archive content: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }
  },

  /**
   * Restores multiple archived content items
   * @param input - Object containing variation IDs to restore
   * @returns Promise that resolves when restoration is successful
   */
  bulkRestoreContent: async (
    input: BulkRestoreContentSchema,
  ): Promise<void> => {
    const response = await fetch(`${baseUrl}/v3/content/restore`, {
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
        `Failed to bulk restore content: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }
  },
};
