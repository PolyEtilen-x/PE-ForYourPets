import React from 'react';

interface PulseLineProps {
  style?: React.CSSProperties;
  className?: string;
}

export default function PulseLine({ style, className }: PulseLineProps) {
  return (
    <svg
      viewBox="0 0 1000 60"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      style={{ display: 'block', ...style }}
    >
      <path
        d="M0 30 L180 30 L200 30 L215 8 L225 52 L233 15 L241 45 L249 30 L400 30 L415 8 L425 52 L433 15 L441 45 L449 30 L600 30 L615 8 L625 52 L633 15 L641 45 L649 30 L800 30 L815 8 L825 52 L833 15 L841 45 L849 30 L1000 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
