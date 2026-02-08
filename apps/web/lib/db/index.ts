import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";
// Use this object to send drizzle queries to your DB
// casing: 'snake_case' converts camelCase (TypeScript) → snake_case (database)
export const db =
  process.env.POSTGRES_URL || process.env.DATABASE_URL
    ? drizzle(sql, { schema, casing: "snake_case" })
    : drizzle(
        {
          // Mock client that does nothing but satisfies type checker for build time
          // This prevents build errors when environment variables are missing
          query: async () => [],
        } as any,
        { schema },
      );
