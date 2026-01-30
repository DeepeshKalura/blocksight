import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  uuid,
  jsonb,
  index,
  primaryKey,
  integer,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ============================================================================
// EXISTING AUTH TABLES
// ============================================================================

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (auth) => ({
    compositePK: primaryKey({
      columns: [auth.userId, auth.credentialID],
    }),
  }),
);

// ============================================================================
// NEW: USER-DAPP RELATIONSHIP TABLE
// ============================================================================

export const userDapps = pgTable(
  "user_dapps",
  {
    id: uuid("id").defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contractAddress: varchar("contract_address", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    tokenName: varchar("token_name", { length: 255 }),
    tokenSymbol: varchar("token_symbol", { length: 50 }),
    chain: varchar("chain", { length: 50 }).notNull().default("ethereum"),
    isDemo: boolean("is_demo").default(false).notNull(),
    lastViewedAt: timestamp("last_viewed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.contractAddress],
    }),
    uniqueSlug: uniqueIndex("idx_user_dapps_slug").on(table.slug),
    idxUser: index("idx_user_dapps_user").on(table.userId),
    idxContract: index("idx_user_dapps_contract").on(table.contractAddress),
  }),
);

// ============================================================================
// NEW: INDEXING QUEUE TRACKING TABLE
// ============================================================================

export const indexingJobs = pgTable(
  "indexing_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    contractAddress: varchar("contract_address", { length: 255 }).notNull(),
    chain: varchar("chain", { length: 50 }).notNull().default("ethereum"),
    qstashMessageId: varchar("qstash_message_id", { length: 255 }),
    priority: integer("priority").notNull().default(5),
    status: varchar("status", { length: 50 }).notNull().default("queued"),
    retryCount: integer("retry_count").notNull().default(0),
    errorMessage: text("error_message"),
    queuedAt: timestamp("queued_at").notNull().defaultNow(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
  },
  (table) => ({
    idxStatusPriority: index("idx_jobs_status_priority").on(
      table.status,
      table.priority,
    ),
    idxContract: index("idx_jobs_contract").on(table.contractAddress),
    idxUserStatus: index("idx_jobs_user_status").on(table.userId, table.status),
  }),
);

// ============================================================================
// ENHANCED: INDEXED PROJECTS TABLE
// ============================================================================

export const indexedProjects = pgTable(
  "indexed_projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractAddress: varchar("contract_address", { length: 255 }).notNull(),
    tokenName: varchar("token_name", { length: 255 }),
    tokenSymbol: varchar("token_symbol", { length: 50 }),
    slug: varchar("slug", { length: 255 }).notNull(),
    dashboardData: jsonb("dashboard_data").notNull(),
    dataHash: varchar("data_hash", { length: 64 }),
    lastFetchedAt: timestamp("last_fetched_at").notNull().defaultNow(),
    nextUpdateAt: timestamp("next_update_at"),
    totalTransactions: integer("total_transactions").default(0),
    totalWallets: integer("total_wallets").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueContract: uniqueIndex("idx_projects_contract_unique").on(
      table.contractAddress,
    ),
    uniqueSlug: uniqueIndex("idx_projects_slug_unique").on(table.slug),
    idxContract: index("idx_projects_contract").on(table.contractAddress),
    idxSlug: index("idx_projects_slug").on(table.slug),
    idxNextUpdate: index("idx_projects_next_update").on(table.nextUpdateAt),
  }),
);

// ============================================================================
// ENHANCED: INDEXING REQUESTS TABLE
// ============================================================================

export const indexingRequests = pgTable(
  "indexing_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contractAddress: varchar("contract_address", { length: 255 }).notNull(),
    chain: varchar("chain", { length: 50 }).notNull().default("ethereum"),
    status: varchar("status", { length: 50 }).notNull().default("PENDING"),
    jobId: varchar("job_id", { length: 255 }),
    errorMessage: text("error_message"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    idxUserStatus: index("idx_requests_user_status").on(
      table.userId,
      table.status,
    ),
    idxContract: index("idx_requests_contract").on(table.contractAddress),
    idxStatus: index("idx_requests_status").on(table.status),
  }),
);

// ============================================================================
// NEW: MOCK/DEMO DAPPS TABLE
// ============================================================================

export const mockDapps = pgTable(
  "mock_dapps",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    logoUrl: varchar("logo_url", { length: 500 }),
    chain: varchar("chain", { length: 50 }).notNull(),
    contractAddress: varchar("contract_address", { length: 255 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 255 }).notNull(),
    dashboardData: jsonb("dashboard_data").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueSlug: uniqueIndex("idx_mock_slug_unique").on(table.slug),
    uniqueContract: uniqueIndex("idx_mock_contract_unique").on(
      table.contractAddress,
    ),
    idxSlug: index("idx_mock_slug").on(table.slug),
  }),
);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserDapp = typeof userDapps.$inferSelect;
export type NewUserDapp = typeof userDapps.$inferInsert;

export type IndexingJob = typeof indexingJobs.$inferSelect;
export type NewIndexingJob = typeof indexingJobs.$inferInsert;

export type IndexedProject = typeof indexedProjects.$inferSelect;
export type NewIndexedProject = typeof indexedProjects.$inferInsert;

export type IndexingRequest = typeof indexingRequests.$inferSelect;
export type NewIndexingRequest = typeof indexingRequests.$inferInsert;

export type MockDapp = typeof mockDapps.$inferSelect;
export type NewMockDapp = typeof mockDapps.$inferInsert;
