import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  typeUser: varchar("type_user", { length: 50 }),
  planTier: varchar("plan_tier", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});