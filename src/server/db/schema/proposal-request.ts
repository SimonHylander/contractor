import { index } from "drizzle-orm/pg-core";
import { appSchema } from "../app-schema";
import { v7 as uuidv7 } from "uuid";
import type { InferSelectModel } from "drizzle-orm";
import type { ClassificationResult } from "~/server/data-access/proposal-request/classify";

export const proposalRequests = appSchema.table(
  "proposal_request",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv7()),
    userId: d.uuid("source_user_id").notNull(),
    projectId: d.uuid("project_id").notNull(),
    email: d.varchar({ length: 40 }),
    description: d.text(),
    classification: d.jsonb("classification").$type<ClassificationResult>(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("idx_user_id").on(t.userId)],
);

export type ProposalRequest = InferSelectModel<typeof proposalRequests>;
