import type { InferSelectModel } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { appSchema } from "../app-schema";

export const proposals = appSchema.table(
  "proposal",
  (d) => ({
    id: d.uuid("id").primaryKey().notNull(),
    userId: d.uuid("user_id").notNull(),
    url: d.varchar({ length: 90 }),
    title: d.varchar({ length: 255 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("proposal_idx_user_id").on(t.userId)],
);

export type Proposal = InferSelectModel<typeof proposals>;
