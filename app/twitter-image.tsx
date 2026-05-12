import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Apha Health Plan premium Medicare guidance';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '48px',
          background:
            'radial-gradient(circle at 20% 15%, rgba(94,234,212,0.28), transparent 28%), radial-gradient(circle at 78% 24%, rgba(96,165,250,0.22), transparent 26%), linear-gradient(135deg, #041b2a 0%, #082c3e 48%, #0f766e 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            borderRadius: '36px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
            padding: '46px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '28px',
                background:
                  'radial-gradient(circle at 28% 22%, rgba(94,234,212,0.95), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.16), transparent), #062a3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                fontWeight: 900,
                letterSpacing: '-0.08em',
              }}
            >
              AH
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-0.05em' }}>Apha</div>
              <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#9ee7e3' }}>
                Health Plan
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '760px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '999px',
                padding: '12px 18px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#c6fdf8',
              }}
            >
              Modern Medicare guidance, designed around you
            </div>
            <div style={{ fontSize: '70px', fontWeight: 900, lineHeight: 0.96, letterSpacing: '-0.07em' }}>
              Health plan decisions, made calmer and clearer.
            </div>
            <div style={{ fontSize: '28px', lineHeight: 1.5, color: '#d8eef0' }}>
              Premium consultation intake, compliant Medicare guidance, and licensed insurance support coordinated through Apha Health Plan.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
