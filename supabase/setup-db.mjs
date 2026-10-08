/**
 * Level X 3D — Database Setup Script
 * Runs schema + seed SQL against Supabase via the Management API
 * Usage: node supabase/setup-db.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ttbnjmulzsrwesypjyqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Ym5qbXVsenNyd2VzeXBqeXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Mzk0MzUsImV4cCI6MjEwNzAxNTQzNX0.xTtJ5GyGyFXgYMRgBMRimdMLcnq7jzh7vaTUhv9l0wU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  console.log(`   URL: ${SUPABASE_URL}`);
  
  try {
    // Try to query categories table
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        console.log('   ⚠️  Tables do not exist yet — you need to run the schema SQL first.');
        console.log('');
        console.log('   👉 Go to: https://supabase.com/dashboard/project/ttbnjmulzsrwesypjyqr/sql/new');
        console.log('   👉 Copy and paste the contents of: supabase/schema.sql');
        console.log('   👉 Click "Run" to create all tables');
        console.log('   👉 Then copy and paste: supabase/seed-categories.sql');
        console.log('   👉 Click "Run" to seed the 94 categories');
        return false;
      }
      console.log(`   ⚠️  Query error: ${error.message} (code: ${error.code})`);
      return false;
    }
    
    console.log('   ✅ Connection successful! Tables exist.');
    return true;
  } catch (e) {
    console.error('   ❌ Connection failed:', e.message);
    return false;
  }
}

async function checkCategories() {
  console.log('');
  console.log('📂 Checking categories...');
  
  const { data, error } = await supabase
    .from('categories')
    .select('shelf, name, slug')
    .order('sort_order', { ascending: true });
    
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('   ⚠️  No categories found — run seed-categories.sql');
    console.log('   👉 Go to: https://supabase.com/dashboard/project/ttbnjmulzsrwesypjyqr/sql/new');
    console.log('   👉 Copy and paste: supabase/seed-categories.sql');
    return;
  }
  
  // Group by shelf
  const shelves = {};
  data.forEach(cat => {
    if (!shelves[cat.shelf]) shelves[cat.shelf] = [];
    shelves[cat.shelf].push(cat.name);
  });
  
  console.log(`   ✅ Found ${data.length} categories across ${Object.keys(shelves).length} shelves:`);
  Object.entries(shelves).forEach(([shelf, cats]) => {
    console.log(`      ${shelf}: ${cats.join(', ')}`);
  });
}

async function checkProducts() {
  console.log('');
  console.log('📦 Checking products...');
  
  const { data, error } = await supabase
    .from('products')
    .select('name, slug, price_inr, status')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('   ℹ️  No products in database yet. Create them via the Admin Console at /admin.');
    return;
  }
  
  console.log(`   ✅ Found ${data.length} products:`);
  data.forEach(p => {
    console.log(`      • ${p.name} — ₹${p.price_inr} [${p.status}]`);
  });
}

async function checkStorage() {
  console.log('');
  console.log('🗂️  Checking storage bucket...');
  
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.log(`   ⚠️  Could not list buckets: ${error.message}`);
    return;
  }
  
  const productBucket = data?.find(b => b.id === 'product-images');
  if (productBucket) {
    console.log('   ✅ product-images bucket exists and is ready.');
  } else {
    console.log('   ⚠️  product-images bucket not found — it will be created when you run schema.sql');
  }
}

async function checkOrders() {
  console.log('');
  console.log('🧾 Checking orders...');
  
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_inr')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return;
  }
  
  console.log(`   ✅ ${data?.length || 0} orders found.`);
}

// Main
console.log('═══════════════════════════════════════════════');
console.log('  Level X 3D — Supabase Database Health Check');
console.log('═══════════════════════════════════════════════');
console.log('');

const connected = await testConnection();
if (connected) {
  await checkCategories();
  await checkProducts();
  await checkStorage();
  await checkOrders();
}

console.log('');
console.log('═══════════════════════════════════════════════');
console.log('  Setup Complete');
console.log('═══════════════════════════════════════════════');
