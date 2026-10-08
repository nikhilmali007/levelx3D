import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.ttbnjmulzsrwesypjyqr',
  password: 'WKCEv2EZ#x.!jWG',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

await client.connect();

// Storage RLS
try {
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'buckets' AND policyname = 'buckets_public_read'
      ) THEN
        CREATE POLICY "buckets_public_read" ON storage.buckets FOR SELECT USING (true);
      END IF;
    END $$;
  `);
  console.log('✅ Storage buckets policy created');
} catch (e) {
  console.log('Note:', e.message);
}

// Objects RLS: allow insert/upload/select
try {
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'objects_public_insert'
      ) THEN
        CREATE POLICY "objects_public_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
      END IF;
    END $$;
  `);
  console.log('✅ Storage objects insert policy created');
} catch (e) {
  console.log('Note:', e.message);
}

await client.end();
console.log('Done!');
