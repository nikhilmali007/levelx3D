import pg from 'pg';
const { Client } = pg;

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ca-central-1',
  'sa-east-1'
];

const password = 'WKCEv2EZ#x.!jWG';
const user = 'postgres.ttbnjmulzsrwesypjyqr';

async function testRegions() {
  console.log('Testing regions for tenant:', user);
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    process.stdout.write(`Trying ${host}... `);
    const client = new Client({
      host,
      port: 6543,
      user,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      console.log('✅ CONNECTED to', region);
      const res = await client.query('SELECT current_database(), version();');
      console.log('Result:', res.rows[0]);
      await client.end();
      return region;
    } catch (err) {
      console.log('❌', err.message);
      try { await client.end(); } catch (e) {}
    }
  }
  return null;
}

testRegions().then((r) => {
  if (r) {
    console.log('\n🎉 FOUND WORKING REGION:', r);
  } else {
    console.log('\n⚠️ No region matched pooler.');
  }
});
