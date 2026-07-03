'use client';

import React from 'react';
import { ASSEMBLY, GEOMETRY } from '../constants';

const MINT = '#8FE3C0';

// StatusLed: a tiny indicator LED on the front face, near top.
// Position in local body space: upper area, on the front glass face.
export default function StatusLed() {
  const [lx, ly, lz] = ASSEMBLY.STATUS_LED_LOCAL;
  const r = 0.12; // Small visible dot — spec says 12mm TOTAL diameter, this is the LED core

  return (
    <group position={[lx, ly, lz]}>
      {/* Core LED — small bright dot */}
      <mesh>
        <sphereGeometry args={[r, 12, 12]} />
        <meshStandardMaterial color={MINT} emissive={MINT} emissiveIntensity={3.0} />
      </mesh>

      {/* Tiny soft halo — only 2× core radius, NOT a huge bloom */}
      <mesh>
        <sphereGeometry args={[r * 2.0, 8, 8]} />
        <meshStandardMaterial color={MINT} emissive={MINT} emissiveIntensity={0.8}
          transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
