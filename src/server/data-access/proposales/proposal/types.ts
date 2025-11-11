import z from "zod/v4";

export const rfpSchema = z.object({
  email: z.email(),
  company_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  message: z.string().optional(),
  language: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  is_test: z.string().optional(),
  silent_confirmation: z.string().optional(),
});

export type RfpSchema = z.infer<typeof rfpSchema>;

// Background image/video schemas
const backgroundImageSchema = z.object({
  id: z.number(),
  uuid: z.string(),
});

const backgroundVideoSchema = z.object({
  id: z.number(),
  uuid: z.string(),
});

const recipientSchema = z.union([
  z.object({
    id: z.number(),
  }),
  z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company_name: z.string().optional(),
    sources: z
      .object({
        integration: z.object({
          id: z.number(),
          contactId: z.string(),
          metadata: z.record(z.string(), z.unknown()),
        }),
      })
      .optional(),
  }),
]);

export type Recipient = z.infer<typeof recipientSchema>;

const blockSchema = z.union([
  z.object({
    content_id: z.number(),
    type: z.literal("product-block"),
  }),
  z.object({
    type: z.literal("video-block"),
    video_url: z.string(),
    title: z.string(),
  }),
]);

const attachmentSchema = z.object({
  mime_type: z.string(),
  name: z.string(),
  url: z.string(),
});

export const createProposalSchema = z.object({
  company_id: z.number(),
  language: z.string().length(2), // ISO 3166-1 alpha-2 language code
  contact_email: z.string().email().optional(),
  background_image: backgroundImageSchema.optional(),
  background_video: backgroundVideoSchema.optional(),
  title_md: z.string().optional(),
  description_md: z.string().optional(),
  recipient: recipientSchema.optional(),
  data: z.record(z.string(), z.unknown()).optional(), // Proposal metadata object
  blocks: z.array(blockSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
});

export type CreateProposalSchema = z.infer<typeof createProposalSchema>;

export const patchProposalDataSchema = z.object({
  company_id: z.number(),
  status: z.enum(["active"]),
  /* title_md: z.string().optional(),
  description_md: z.string().optional(),
  contact_email: z.string().email().optional(),
  background_image: backgroundImageSchema.optional(),
  background_video: backgroundVideoSchema.optional(),
  recipient: recipientSchema.optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  blocks: z.array(blockSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  expires_at: z.number().nullable().optional(),
  language: z.string().length(2).optional(), */
});

export type PatchProposalDataSchema = z.infer<typeof patchProposalDataSchema>;

/**
 * Search Query params
 */
export interface ProposalSearchParams {
  "filter[status]"?: string;
  "filter[company_id]"?: number;
  "filter[recipient_email]"?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

/**
 * (GET /v3/proposals/{uuid})
 */
export const proposalResponseSchema = z.object({
  title: z.string().optional(),
  title_md: z.string().optional(),
  description_html: z.string().optional(),
  description_md: z.string().optional(),
  archived_at: z.number().nullable().optional(),
  attachments: z.array(z.unknown()).optional(),
  background_image: backgroundImageSchema.optional(),
  background_video: backgroundVideoSchema.optional(),
  blocks: z.array(z.unknown()).optional(),
  company_address: z.string().optional(),
  company_email: z.string().optional(),
  company_id: z.number(),
  company_logo_uuid: z.string().optional(),
  company_powerups: z.record(z.string(), z.unknown()).optional(),
  company_powerups_live: z.record(z.string(), z.unknown()).optional(),
  company_name: z.string().optional(),
  company_phone: z.string().optional(),
  company_registration_number: z.string().optional(),
  company_tax_mode_live: z.string().optional(),
  company_timezone: z.string().optional(),
  company_avatar_uuid: z.string().optional(),
  contact_email: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_title: z.string().optional(),
  creator_id: z.number().optional(),
  creator_name: z.string().optional(),
  currency: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  editor: z
    .object({
      notification_user_ids: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
  expires_at: z.number().nullable().optional(),
  invoicing: z.record(z.string(), z.unknown()).optional(),
  is_agreement: z.boolean().optional(),
  is_only_proposal_in_series: z.boolean().optional(),
  is_test: z.boolean().optional(),
  pending: z.boolean().optional(),
  pending_reason: z.string().optional(),
  recipient_company_name: z.string().optional(),
  recipient_email: z.string().optional(),
  recipient_id: z.number().optional(),
  recipient_is_set: z.boolean().optional(),
  recipient_name: z.string().optional(),
  recipient_phone: z.string().optional(),
  recipient_sources: z.record(z.string(), z.unknown()).optional(),
  series_uuid: z.string().optional(),
  signatures: z.array(z.unknown()).optional(),
  status_changed_at: z.number().optional(),
  tax_options: z.record(z.string(), z.unknown()).optional(),
  tracking: z.record(z.string(), z.unknown()).optional(),
  updated_at: z.number().optional(),
  value_with_tax: z.number().optional(),
  value_without_tax: z.number().optional(),
  version: z.number().optional(),
  payments_enabled: z.boolean().optional(),
  contact_avatar_transform: z.string().optional(),
  user_email: z.string().optional(),
  payment: z.record(z.string(), z.unknown()).optional(),
  status: z.string().optional(),
  uuid: z.string(),
  language: z.string().optional(),
  background_image_uuid: z.string().optional(),
});

export type ProposalResponse = z.infer<typeof proposalResponseSchema>;

export const proposalDataResponseSchema = z.object({
  data: proposalResponseSchema,
});

export type ProposalDataResponse = z.infer<typeof proposalDataResponseSchema>;

export const createProposalResponseSchema = z.object({
  proposal: z.object({
    uuid: z.string(),
    url: z.string().optional(),
  }),
});

export type CreateProposalResponse = z.infer<
  typeof createProposalResponseSchema
>;

export const proposalSearchItemSchema = z.object({
  title: z.string().optional(),
  uuid: z.string(),
  status: z.string().optional(),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
  company_id: z.number().optional(),
  recipient_email: z.string().optional(),
  recipient_name: z.string().optional(),
});

export type ProposalSearchItem = z.infer<typeof proposalSearchItemSchema>;

export const proposalSearchResponseSchema = z.object({
  data: z.array(proposalSearchItemSchema),
});

export type ProposalSearchResponse = z.infer<
  typeof proposalSearchResponseSchema
>;
