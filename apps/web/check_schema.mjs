import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

try {
  // Check current schema
  const currentSchema = await sql`SELECT current_schema();`;
  console.log('Current schema:', currentSchema.rows[0].current_schema);
  
  // List all tables in public schema
  const tables = await sql`
    SELECT table_name, table_schema 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  console.log('\nTables in public schema:');
  tables.rows.forEach(row => {
    console.log(`  - ${row.table_name} (schema: ${row.table_schema})`);
  });
  
  // Check if specific auth tables exist
  const authTables = ['users', 'accounts', 'sessions', 'verificationTokens', 'verification_tokens'];
  console.log('\nChecking auth tables:');
  for (const table of authTables) {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${table}
      ) as exists;
    `;
    console.log(`  ${table}: ${result.rows[0].exists ? 'EXISTS' : 'DOES NOT EXIST'}`);
  }
} catch (error) {
  console.error('Error:', error.message);
  console.error('\nFull error:', JSON.stringify(error, null, 2));
}
