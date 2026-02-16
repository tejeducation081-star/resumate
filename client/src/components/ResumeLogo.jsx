import React from 'react';

export default function ResumeLogo({ size = 40, dark = false }) {
  const primary = dark ? '#FFFFFF' : '#2563EB';
  const secondary = dark ? 'rgba(255, 255, 255, 0.7)' : '#1E40AF';
  const accentLine = dark ? 'rgba(255, 255, 255, 0.4)' : '#3B82F6';

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/logo_final.png"
        alt="Resumate"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
