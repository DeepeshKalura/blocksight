import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
// Use this object to send drizzle queries to your DB
export const db = (process.env.POSTGRES_URL || process.env.DATABASE_URL)
    ? drizzle(sql, { schema })
    : drizzle({
        // Mock client that does nothing but satisfies type checker for build time
        // This prevents build errors when environment variables are missing
        query: async () => [],
    } as any, { schema });