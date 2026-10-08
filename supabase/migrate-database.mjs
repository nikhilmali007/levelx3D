import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const host = 'aws-0-ap-northeast-1.pooler.supabase.com';
const port = 6543;
const user = 'postgres.ttbnjmulzsrwesypjyqr';
const password = 'WKCEv2EZ#x.!jWG';
const database = 'postgres';

async function migrate() {
  console.log('🚀 Connecting to Supabase database in ap-northeast-1...');
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Postgres database!');

    // 1. Run schema.sql
    console.log('\n📄 Executing schema.sql...');
    const schemaSql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('✅ schema.sql executed successfully! All 7 tables, indexes, and storage bucket created.');

    // 2. Run seed-categories.sql
    console.log('\n🌱 Executing seed-categories.sql...');
    const seedCategoriesSql = readFileSync(join(__dirname, 'seed-categories.sql'), 'utf-8');
    await client.query(seedCategoriesSql);
    console.log('✅ seed-categories.sql executed successfully! 94 categories seeded.');

    // 3. Seed initial 6 products from Signature / Premium shelf
    console.log('\n🛍️ Seeding initial Signature products into database...');
    const { rows: categories } = await client.query('SELECT id, slug, name FROM public.categories;');
    const catMap = new Map();
    categories.forEach(c => catMap.set(c.slug, c.id));

    const initialProducts = [
      {
        name: 'Lumina Voronoi Designer Lamp',
        slug: 'lumina-voronoi-designer-lamp',
        description: 'Parametric SLA lattice lamp calculated using 3D Voronoi cell partitioning. Casts diffuse, non-repeating shadows across horizontal planes.',
        categorySlug: 'premium-designer-lamps',
        price_inr: 28500,
        compare_at_price_inr: 34000,
        is_customizable: true,
        is_premium: true,
        stock: 6,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=85',
        ],
        options: [
          {
            name: 'Light Temperature',
            type: 'select',
            values: [
              { label: '2700K Warm Tungsten', value: '2700K' },
              { label: '3500K Neutral Studio', value: '3500K' },
            ],
          },
          {
            name: 'Cord Finish',
            type: 'color',
            values: [
              { label: 'Obsidian Black', value: '#111111', color: '#111111' },
              { label: 'Braided Bone', value: '#F3F1EC', color: '#F3F1EC' },
            ],
          },
        ],
      },
      {
        name: 'Aura Géométrique Luxury Handbag',
        slug: 'aura-geometrique-luxury-handbag',
        description: 'Monocoque lattice clutch sintered in flexible PA12 polymer with magnetic titanium clasp mechanism.',
        categorySlug: 'luxury-handbags',
        price_inr: 42000,
        compare_at_price_inr: 52000,
        is_customizable: true,
        is_premium: true,
        stock: 3,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
        ],
        options: [
          {
            name: 'Finish',
            type: 'select',
            values: [
              { label: 'Vapor-Polished Jet Black', value: 'Jet Black' },
              { label: 'Raw Alabaster Gypsum', value: 'Alabaster' },
            ],
          },
          {
            name: 'Monogram Engraving',
            type: 'text',
            values: [{ placeholder: 'Up to 3 characters' }],
          },
        ],
      },
      {
        name: 'Maha Mandir Bespoke Temple',
        slug: 'maha-mandir-bespoke-temple',
        description: 'Architectural domestic temple engineered with sacred fractal proportions and integrated micro-LED backlighting.',
        categorySlug: 'premium-custom-temple',
        price_inr: 85000,
        compare_at_price_inr: 98000,
        is_customizable: true,
        is_premium: true,
        stock: 2,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=85',
        ],
        options: [
          {
            name: 'Scale',
            type: 'select',
            values: [
              { label: 'Standard (450mm H)', value: 'Standard' },
              { label: 'Estate (650mm H)', value: 'Estate' },
            ],
          },
        ],
      },
      {
        name: 'Carrera 911 Silhouette Frame Wall Art',
        slug: 'carrera-911-silhouette-frame-wall-art',
        description: 'Multi-layer topographic automotive wall sculpture depicting the iconic silhouette in sintered carbon-infused nylon.',
        categorySlug: '3d-car-frame-wall-art',
        price_inr: 18500,
        compare_at_price_inr: 22000,
        is_customizable: false,
        is_premium: true,
        stock: 8,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=85',
        ],
        options: [],
      },
      {
        name: 'Toroid Continuum Wall Sculpture',
        slug: 'toroid-continuum-wall-sculpture',
        description: 'Flowing parametric Mobius-inspired sculpture engineered for acoustic dispersion and shadows in modern galleries.',
        categorySlug: 'wall-sculptures',
        price_inr: 32000,
        compare_at_price_inr: 38000,
        is_customizable: false,
        is_premium: true,
        stock: 4,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=85',
        ],
        options: [],
      },
      {
        name: 'Archival Lithophane Photo Art Portrait',
        slug: 'archival-lithophane-photo-art-portrait',
        description: 'Ultra-high resolution variable-density photopolymer art piece revealed only when illuminated from behind.',
        categorySlug: 'lithophane-photo-art',
        price_inr: 12500,
        compare_at_price_inr: 15000,
        is_customizable: true,
        is_premium: true,
        stock: 15,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=85',
        ],
        options: [
          {
            name: 'Frame Tone',
            type: 'color',
            values: [
              { label: 'Anodized Matte Black', value: '#1E1E1E', color: '#1E1E1E' },
              { label: 'Natural Brushed Aluminum', value: '#D8D8D8', color: '#D8D8D8' },
            ],
          },
          {
            name: 'Photo Inscription',
            type: 'text',
            values: [{ placeholder: 'Date or message on reverse' }],
          },
        ],
      },
    ];

    for (const prod of initialProducts) {
      const catId = catMap.get(prod.categorySlug) || null;
      const { rows: inserted } = await client.query(
        `INSERT INTO public.products (
          name, slug, description, category_id, price_inr, compare_at_price_inr,
          is_customizable, is_premium, stock, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price_inr = EXCLUDED.price_inr,
          compare_at_price_inr = EXCLUDED.compare_at_price_inr,
          stock = EXCLUDED.stock
        RETURNING id;`,
        [
          prod.name,
          prod.slug,
          prod.description,
          catId,
          prod.price_inr,
          prod.compare_at_price_inr,
          prod.is_customizable,
          prod.is_premium,
          prod.stock,
          prod.status,
        ]
      );

      const productId = inserted[0]?.id;
      if (productId) {
        // Insert images
        for (let i = 0; i < prod.images.length; i++) {
          await client.query(
            `INSERT INTO public.product_images (product_id, url, sort_order)
             VALUES ($1, $2, $3);`,
            [productId, prod.images[i], i]
          );
        }

        // Insert options
        for (const opt of prod.options) {
          await client.query(
            `INSERT INTO public.product_options (product_id, name, type, values)
             VALUES ($1, $2, $3, $4);`,
            [productId, opt.name, opt.type, JSON.stringify(opt.values)]
          );
        }
      }
    }
    console.log('✅ Initial products and options seeded into Supabase!');

    // 4. Verify counts
    const { rows: catCount } = await client.query('SELECT COUNT(*) FROM public.categories;');
    const { rows: prodCount } = await client.query('SELECT COUNT(*) FROM public.products;');
    console.log(`\n🎉 MIGRATION SUCCESSFUL!`);
    console.log(`   📊 Categories in DB: ${catCount[0].count}`);
    console.log(`   📦 Products in DB:   ${prodCount[0].count}`);

    await client.end();
  } catch (err) {
    console.error('❌ Migration failed:', err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

migrate();
