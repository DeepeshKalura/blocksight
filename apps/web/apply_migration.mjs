import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const fs = await import('fs');
const migration = fs.readFileSync('drizzle/0000_fresh_auth.sql', 'utf8');

try {
  await sql.query(migration);
  console.log('✓ Migration applied successfully');
} catch (e) {
  if (e.message.includes('already exists') || e.code === '42P07') {
    console.log('✓ Tables already exist (expected)');
  } else {
    console.log('Error:', e.message);
    console.log('Code:', e.code);
  }
}
