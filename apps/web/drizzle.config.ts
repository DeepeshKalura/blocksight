import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

// Skip validation during production builds - db commands are run separately
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  throw new Error(
    "DATABASE_URL environment variable is required for database operations",
  );
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  verbose: true,
  strict: true,
  schemaFilter: "public",
});
