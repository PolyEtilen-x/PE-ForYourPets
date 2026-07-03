'use client';

import React from 'react';
import { ASSEMBLY, GEOMETRY } from '../constants';

interface TurntableProps {
  color: string;
}

/**
 * Turntable — sits directly on top of Base.
 * Spec: radius 2.3cm, height 1.2cm.
 * Has a visible rotation groove at bottom (dark gap) and bevel on top.
 */
export default function Turntable({ color }: TurntableProps) {
  const r = GEOMETRY.TURNTABLE_RADIUS;        // 2.3
  const h = ASSEMBLY.TURNTABLE_H;             // 1.2
  const y0 = ASSEMBLY.BASE_TOP_Y;            // -1.575

  return (
    <group position={[0, y0, 0]}>
      {/* Rotation groove (dark gap between base top and turntable) */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[r - 0.06, r - 0.06, 0.08, 64]} />
        <meshStandardMaterial color="#181818" roughness={0.95} />
      </mesh>

      {/* Main disc */}
      <mesh position={[0, h / 2 + 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, h, 64]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.38}
          clearcoat={0.12}
          clearcoatRoughness={0.25}
          metalness={0.04}
        />
      </mesh>

      {/* Top chamfer */}
      <mesh position={[0, h + 0.08, 0]}>
        <torusGeometry args={[r - 0.06, 0.06, 16, 64]} />
        <meshPhysicalMaterial color={color} roughness={0.38} clearcoat={0.12} metalness={0.04} />
      </mesh>
    </group>
  );
}
