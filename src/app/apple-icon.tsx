import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#171716',
        borderRadius: 38,
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      <div style={{ background: '#8AAAC4', borderRadius: 14, height: 74, position: 'absolute', transform: 'rotate(-8deg)', width: 94 }} />
      <div style={{ background: '#F3F2EE', borderRadius: 14, display: 'flex', height: 74, transform: 'rotate(4deg)', width: 94 }} />
    </div>,
    size,
  );
}
