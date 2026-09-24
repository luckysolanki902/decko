import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#171716',
        borderRadius: 14,
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      <div style={{ background: '#8AAAC4', borderRadius: 5, height: 27, position: 'absolute', transform: 'rotate(-8deg)', width: 34 }} />
      <div style={{ background: '#F3F2EE', borderRadius: 5, display: 'flex', height: 27, transform: 'rotate(4deg)', width: 34 }} />
    </div>,
    size,
  );
}
