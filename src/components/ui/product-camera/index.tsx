import React from 'react';

export const CAM_COLORS = {
  sand: { hex: '#C4A882', body: '#C9AD8A', shadow: '#9A7A58', highlight: '#DCC9A6' },
  sage: { hex: '#7A9E7E', body: '#7A9E7E', shadow: '#5A7A5E', highlight: '#9ABEA0' },
  charcoal: { hex: '#5A5A62', body: '#5A5A62', shadow: '#3A3A42', highlight: '#7A7A82' },
} as const;

export type ColorKey = keyof typeof CAM_COLORS;

interface ProductCameraProps {
  colorKey: ColorKey;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductCamera({
  colorKey,
  rotation = 0,
  className,
  style,
}: ProductCameraProps) {
  const c = CAM_COLORS[colorKey];
  const scaleX = 0.84 + Math.abs(Math.cos((rotation * Math.PI) / 180)) * 0.16;
  const id = colorKey;

  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      style={{
        filter: 'drop-shadow(0 20px 44px rgba(0,0,0,0.42))',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      <defs>
        <radialGradient id={`sg-${id}`} cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="50%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.shadow} />
        </radialGradient>
        <radialGradient id={`lg-${id}`} cx="35%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#2a2a38" />
          <stop offset="45%" stopColor="#141420" />
          <stop offset="100%" stopColor="#060610" />
        </radialGradient>
        <radialGradient id={`bg-${id}`} cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={c.highlight} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.body} stopOpacity="0" />
        </radialGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sm">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Ambient shadow on surface */}
      <ellipse cx="150" cy="268" rx="80" ry="11" fill="#000" opacity="0.28" filter="url(#sm)" />

      {/* Base disc */}
      <ellipse cx="150" cy="256" rx="62" ry="9" fill={c.shadow} />
      <ellipse cx="150" cy="252" rx="58" ry="7" fill={c.body} opacity="0.6" />

      {/* Neck connector */}
      <rect x="132" y="222" width="36" height="34" rx="8" fill={c.shadow} />
      <rect x="135" y="222" width="30" height="28" rx="6" fill={c.body} opacity="0.5" />

      {/* Sphere body */}
      <circle
        cx="150" cy="138" r="108"
        fill={`url(#sg-${id})`}
        style={{
          transformOrigin: '150px 138px',
          transform: `scaleX(${scaleX})`,
        }}
      />
      {/* Top specular */}
      <ellipse cx="120" cy="88" rx="38" ry="28" fill={`url(#bg-${id})`} />

      {/* Lens housing ring */}
      <circle cx="150" cy="138" r="48" fill={c.shadow} opacity="0.9" />
      {/* Lens glass */}
      <circle cx="150" cy="138" r="40" fill={`url(#lg-${id})`} />
      {/* Inner lens rings */}
      <circle cx="150" cy="138" r="30" fill="#0e0e1a" opacity="0.85" />
      <circle cx="150" cy="138" r="20" fill="#080810" />
      <circle cx="150" cy="138" r="11" fill="#030306" />
      {/* Lens glint */}
      <ellipse
        cx="139"
        cy="128"
        rx="8"
        ry="5.5"
        fill="white"
        opacity="0.13"
        transform="rotate(-20, 139, 128)"
      />
      <ellipse cx="157" cy="148" rx="3" ry="2" fill="white" opacity="0.06" />

      {/* LED ring — mint glow */}
      <circle cx="150" cy="138" r="50" fill="none" stroke="#8FE3C0" strokeWidth="1.8" opacity="0.85" />
      <circle cx="150" cy="138" r="50" fill="none" stroke="#8FE3C0" strokeWidth="8" opacity="0.12" />
      <circle cx="150" cy="138" r="50" fill="none" stroke="#8FE3C0" strokeWidth="16" opacity="0.05" />

      {/* Status dot */}
      <circle cx="210" cy="86" r="4" fill="#8FE3C0" opacity="0.85" />
      <circle cx="210" cy="86" r="8" fill="#8FE3C0" opacity="0.18" />

      {/* Brand strip on neck */}
      <rect x="138" y="232" width="24" height="5" rx="2.5" fill={c.highlight} opacity="0.3" />
    </svg>
  );
}
