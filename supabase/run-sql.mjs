/**
 * Run SQL against Supabase using the SQL Editor REST API
 * This uses the anon key + Supabase REST SQL endpoint
 */
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://ttbnjmulzsrwesypjyqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Ym5qbXVsenNyd2VzeXBqeXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Mzk0MzUsImV4cCI6MjEwNzAxNTQzNX0.xTtJ5GyGyFXgYMRgBMRimdMLcnq7jzh7vaTUhv9l0wU';

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('Usage: node supabase/run-sql.mjs <path-to-sql-file>');
  process.exit(1);
}

const sql = readFileSync(sqlFile, 'utf-8');

// Split SQL into individual statements and run them via the Supabase REST RPC
// The REST API doesn't support raw SQL execution with anon key.
// We need to use the pg connection string or the dashboard.

// Alternative: Use the Supabase JavaScript client to run individual operations
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test with a simple RPC call
console.log('Testing connection to Supabase...');
try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  console.log(`REST API response: ${response.status} ${response.statusText}`);
  
  if (response.ok) {
    console.log('');
    console.log('✅ Supabase REST API is reachable!');
    console.log('');
    console.log('However, running raw SQL requires either:');
    console.log('  1. The Supabase Dashboard SQL Editor (recommended)');
    console.log('  2. A direct PostgreSQL connection (blocked by DNS on this network)');
    console.log('  3. The service_role key with the SQL RPC endpoint');
    console.log('');
    console.log('📋 Please run these SQL files manually in the Supabase Dashboard:');
    console.log(`   1. ${sqlFile}`);
    console.log('');
    console.log('   👉 https://supabase.com/dashboard/project/ttbnjmulzsrwesypjyqr/sql/new');
  }
} catch (e) {
  console.error('Connection failed:', e.message);
}
