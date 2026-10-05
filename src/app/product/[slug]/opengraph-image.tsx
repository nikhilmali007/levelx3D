import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/supabase/store';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  const productName = product?.name || 'Architectural 3D Specimen';
  const priceFormatted = product ? `₹${product.price.toLocaleString('en-IN')}` : '₹18,500';
  const category = product?.category || 'Signature Artifact';
  const shelf = product?.shelf || 'Signature / Premium';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0B0B0B',
          padding: '70px',
          fontFamily: 'sans-serif',
          border: '1px solid #262626',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #444444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F3F1EC',
                fontSize: '22px',
                fontWeight: '300',
              }}
            >
              X
            </div>
            <div
              style={{
                fontSize: '16px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#6E6E6E',
                fontFamily: 'monospace',
              }}
            >
              LEVEL X 3D &bull; ARCHIVAL LEDGER
            </div>
          </div>

          <div
            style={{
              padding: '6px 18px',
              borderRadius: '9999px',
              border: '1px solid #333333',
              color: '#F3F1EC',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              backgroundColor: '#141414',
            }}
          >
            {shelf}
          </div>
        </div>

        {/* Center Content: Category, Title, Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '16px',
              color: '#8E8E8E',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '300',
              color: '#F3F1EC',
              letterSpacing: '0.03em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
            }}
          >
            {productName}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginTop: '10px',
            }}
          >
            <span
              style={{
                fontSize: '42px',
                fontWeight: '400',
                color: '#F3F1EC',
                fontFamily: 'monospace',
              }}
            >
              {priceFormatted}
            </span>
            <span
              style={{
                fontSize: '15px',
                color: '#6E6E6E',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}
            >
              INR &bull; Complimentary Insured Delivery
            </span>
          </div>
        </div>

        {/* Bottom Specifications Bar */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #262626',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px', fontSize: '13px', fontFamily: 'monospace', color: '#6E6E6E' }}>
            <span>&bull; MICRO-SLA 25μm RESOLUTION</span>
            <span>&bull; NUMBERED CERTIFICATE</span>
            <span>&bull; BESPOKE FINISH</span>
          </div>
          <div style={{ fontSize: '14px', color: '#F3F1EC', fontFamily: 'monospace' }}>
            LEVELX3D.COM
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
