import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Level X 3D — Apple-Grade Minimalist 3D E-Commerce';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          padding: '80px',
          fontFamily: 'sans-serif',
          border: '1px solid #262626',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #444444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F3F1EC',
                fontSize: '24px',
                fontWeight: '300',
              }}
            >
              X
            </div>
            <div
              style={{
                fontSize: '18px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#6E6E6E',
                fontFamily: 'monospace',
              }}
            >
              LEVEL X 3D &bull; ATELIER
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: '1px solid #262626',
              color: '#F3F1EC',
              fontSize: '14px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            PAN-INDIA DISPATCH
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: '300',
              color: '#F3F1EC',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}
          >
            Architectural 3D Printing & Bespoke Objects
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#8E8E8E',
              lineHeight: 1.4,
              letterSpacing: '0.01em',
            }}
          >
            Micro-stereolithography 25μm precision, selective laser sintering nylon, and bespoke physical-digital geometries.
          </div>
        </div>

        {/* Bottom Specs */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #262626',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', gap: '40px', fontSize: '14px', fontFamily: 'monospace', color: '#6E6E6E' }}>
            <span>&bull; SIGNATURE SHELVES</span>
            <span>&bull; BESPOKE CUSTOM STUDIO</span>
            <span>&bull; NUMBERED EDITIONS</span>
          </div>
          <div style={{ fontSize: '15px', color: '#F3F1EC', fontFamily: 'monospace' }}>
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
