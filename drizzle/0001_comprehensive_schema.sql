-- Migration: Comprehensive schema for dynamic dApp analytics
-- Created: 2026-02-08

-- ============================================================================
-- DROP OLD TABLES (safe if empty)
-- ============================================================================
DROP TABLE IF EXISTS "indexing_requests_old" CASCADE;
DROP TABLE IF EXISTS "indexed_projects_old" CASCADE;

-- ============================================================================
-- CREATE USER_DAPPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "user_dapps" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "contract_address" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "token_name" varchar(255),
  "token_symbol" varchar(50),
  "chain" varchar(50) NOT NULL DEFAULT 'ethereum',
  "is_demo" boolean NOT NULL DEFAULT false,
  "last_viewed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Add constraints
ALTER TABLE "user_dapps" DROP CONSTRAINT IF EXISTS "unique_user_contract";
ALTER TABLE "user_dapps" ADD CONSTRAINT "unique_user_contract" PRIMARY KEY ("user_id", "contract_address");

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_dapps_slug" ON "user_dapps"("slug");
CREATE INDEX IF NOT EXISTS "idx_user_dapps_user" ON "user_dapps"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_dapps_contract" ON "user_dapps"("contract_address");

-- ============================================================================
-- CREATE INDEXING_JOBS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "indexing_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "type" varchar(50) NOT NULL,
  "contract_address" varchar(255) NOT NULL,
  "chain" varchar(50) NOT NULL DEFAULT 'ethereum',
  "qstash_message_id" varchar(255),
  "priority" integer NOT NULL DEFAULT 5,
  "status" varchar(50) NOT NULL DEFAULT 'queued',
  "retry_count" integer NOT NULL DEFAULT 0,
  "error_message" text,
  "queued_at" timestamp NOT NULL DEFAULT now(),
  "started_at" timestamp,
  "completed_at" timestamp
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_jobs_status_priority" ON "indexing_jobs"("status", "priority");
CREATE INDEX IF NOT EXISTS "idx_jobs_contract" ON "indexing_jobs"("contract_address");
CREATE INDEX IF NOT EXISTS "idx_jobs_user_status" ON "indexing_jobs"("user_id", "status");

-- ============================================================================
-- CREATE INDEXED_PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "indexed_projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "contract_address" varchar(255) NOT NULL UNIQUE,
  "token_name" varchar(255),
  "token_symbol" varchar(50),
  "slug" varchar(255) NOT NULL UNIQUE,
  "dashboard_data" jsonb NOT NULL,
  "data_hash" varchar(64),
  "last_fetched_at" timestamp NOT NULL DEFAULT now(),
  "next_update_at" timestamp,
  "total_transactions" integer DEFAULT 0,
  "total_wallets" integer DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "idx_projects_contract_unique" ON "indexed_projects"("contract_address");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_projects_slug_unique" ON "indexed_projects"("slug");
CREATE INDEX IF NOT EXISTS "idx_projects_contract" ON "indexed_projects"("contract_address");
CREATE INDEX IF NOT EXISTS "idx_projects_slug" ON "indexed_projects"("slug");
CREATE INDEX IF NOT EXISTS "idx_projects_next_update" ON "indexed_projects"("next_update_at");

-- ============================================================================
-- CREATE INDEXING_REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "indexing_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "contract_address" varchar(255) NOT NULL,
  "chain" varchar(50) NOT NULL DEFAULT 'ethereum',
  "status" varchar(50) NOT NULL DEFAULT 'PENDING',
  "job_id" varchar(255),
  "error_message" text,
  "completed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_requests_user_status" ON "indexing_requests"("user_id", "status");
CREATE INDEX IF NOT EXISTS "idx_requests_contract" ON "indexing_requests"("contract_address");
CREATE INDEX IF NOT EXISTS "idx_requests_status" ON "indexing_requests"("status");

-- ============================================================================
-- CREATE MOCK_DAPPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "mock_dapps" (
  "id" varchar(255) PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "logo_url" varchar(500),
  "chain" varchar(50) NOT NULL,
  "contract_address" varchar(255) NOT NULL,
  "description" text,
  "slug" varchar(255) NOT NULL UNIQUE,
  "dashboard_data" jsonb NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "idx_mock_slug_unique" ON "mock_dapps"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_mock_contract_unique" ON "mock_dapps"("contract_address");
CREATE INDEX IF NOT EXISTS "idx_mock_slug" ON "mock_dapps"("slug");

-- ============================================================================
-- UPDATE FUNCTION FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at
DROP TRIGGER IF EXISTS update_user_dapps_updated_at ON "user_dapps";
CREATE TRIGGER update_user_dapps_updated_at BEFORE UPDATE ON "user_dapps"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_indexed_projects_updated_at ON "indexed_projects";
CREATE TRIGGER update_indexed_projects_updated_at BEFORE UPDATE ON "indexed_projects"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mock_dapps_updated_at ON "mock_dapps";
CREATE TRIGGER update_mock_dapps_updated_at BEFORE UPDATE ON "mock_dapps"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONE
-- ============================================================================
