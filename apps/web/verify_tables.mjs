import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

try {
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  console.log('Tables in public schema:');
  tables.rows.forEach(row => {
    console.log(`  - ${row.table_name}`);
  });
  
  // Check if singular auth tables exist
  const authTables = ['user', 'account', 'session', 'verificationToken', 'authenticator'];
  console.log('\nChecking auth tables (singular names):');
  for (const table of authTables) {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${table}
      ) as exists;
    `;
    console.log(`  ${table}: ${result.rows[0].exists ? 'EXISTS ✓' : 'MISSING ✗'}`);
  }
} catch (error) {
  console.error('Error:', error.message);
}
