import z from "zod/v4";

/**
 * Query parameters for listing content
 */
export interface ContentListParams {
  variation_id?: string; // Can be single ID or multiple comma-separated ones
  product_id?: string; // Can be single ID or multiple comma-separated ones
  include_archived?: boolean; // Default: false
  include_sources?: boolean; // Default: false
}

/**
 * Image asset schema
 */
const imageAssetSchema = z.object({
  id: z.number().optional(),
  uuid: z.string().optional(),
  url: z.string().optional(),
});

/**
 * Content item schema (for responses)
 */
export const contentItemSchema = z.object({
  created_at: z.number(),
  description: z.record(z.string(), z.string()), // Language -> description mapping
  product_id: z.number(),
  variation_id: z.number(),
  title: z.record(z.string(), z.string()), // Language -> title mapping
  is_archived: z.boolean().optional(),
  sources: z.record(z.string(), z.unknown()).optional(), // Integration metadata
  images: z.array(imageAssetSchema).optional(),
  integration_id: z.number().optional(),
  integration_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ContentItem = z.infer<typeof contentItemSchema>;

/**
 * Response schema for list content endpoint
 */
export const contentListResponseSchema = z.object({
  data: z.array(contentItemSchema),
});

export type ContentListResponse = z.infer<typeof contentListResponseSchema>;

/**
 * Response schema for single content endpoint (create/update)
 */
export const contentResponseSchema = z.object({
  data: contentItemSchema,
});

export type ContentResponse = z.infer<typeof contentResponseSchema>;

/**
 * Schema for creating content
 */
export const createContentSchema = z.object({
  title: z.record(z.string(), z.string()), // Language -> title mapping
  description: z.record(z.string(), z.string()).optional(), // Language -> description mapping
  product_id: z.number().optional(),
  variation_id: z.number().optional(),
  images: z.array(imageAssetSchema).optional(),
  integration_id: z.number().optional(),
  integration_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateContentSchema = z.infer<typeof createContentSchema>;

/**
 * Schema for updating content
 */
export const updateContentSchema = z.object({
  title: z.record(z.string(), z.string()).optional(), // Language -> title mapping
  description: z.record(z.string(), z.string()).optional(), // Language -> description mapping
  product_id: z.number().optional(),
  images: z.array(imageAssetSchema).optional(),
  integration_id: z.number().optional(),
  integration_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateContentSchema = z.infer<typeof updateContentSchema>;

/**
 * Schema for bulk archive content
 */
export const bulkArchiveContentSchema = z.object({
  variation_ids: z.array(z.number()),
});

export type BulkArchiveContentSchema = z.infer<typeof bulkArchiveContentSchema>;

/**
 * Schema for bulk restore content
 */
export const bulkRestoreContentSchema = z.object({
  variation_ids: z.array(z.number()),
});

export type BulkRestoreContentSchema = z.infer<typeof bulkRestoreContentSchema>;
