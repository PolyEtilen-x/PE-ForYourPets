'use client';

import React from 'react';
import * as THREE from 'three';
import { useTexture, Decal } from '@react-three/drei';
import { ASSEMBLY, GEOMETRY, DIMENSIONS } from '../constants';

interface PivotProps {
  color: string;
}

/**
 * Pivot/Joint — clay reference:
 * - A small cylindrical disc at the connection point between arm and body
 * - Disc diameter ≈ neckJoint.minRadius * 2 = 1.7 cm
 * - Located at (PIVOT_X, PIVOT_Y) — at body sphere equatorial height
 * - Thin cylindrical disc, not a bulky joint
 *
 * From image 3 (3/4 view): clearly a small round disc/collar at the side of body.
 */
export default function Pivot({ color }: PivotProps) {
  const logoTex = useTexture('/logo_noname.png');

  const px    = ASSEMBLY.PIVOT_X;                    // 2.61
  const py    = ASSEMBLY.PIVOT_Y;                    // 2.625
  const r     = GEOMETRY.PIVOT_RADIUS;               // 0.85
  const armHW = 0.45;                                // half of arm cross-section width

  const matProps = { roughness: 0.38, clearcoat: 0.12, clearcoatRoughness: 0.25, metalness: 0.04 };

  return (
    // Rotate so local Y → world X axis (disc face points outward)
    <group position={[px, py, 0]} rotation={[0, 0, -Math.PI / 2]}>

      {/* Main cylindrical disc — the joint knuckle */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r, r, 0.30, 64]} />
        <meshPhysicalMaterial color={color} {...matProps} />
      </mesh>

      {/* Outer chamfer ring (beveled edge of disc) */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[r - 0.06, 0.06, 16, 64]} />
        <meshPhysicalMaterial color={color} {...matProps} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <torusGeometry args={[r - 0.06, 0.06, 16, 64]} />
        <meshPhysicalMaterial color={color} {...matProps} />
      </mesh>

      {/* Assembly gap ring */}
      <mesh position={[0, 0.10, 0]}>
        <cylinderGeometry args={[r - 0.04, r - 0.04, 0.015, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>

      {/* LED status ring */}
      <group position={[0, 0.12, 0]}>
        <mesh>
          <cylinderGeometry args={[r - 0.10, r - 0.10, 0.018, 64]} />
          <meshStandardMaterial color="#A1E8CC" emissive="#A1E8CC" emissiveIntensity={2.5} />
        </mesh>
        <mesh scale={[1.05, 2.2, 1.05]}>
          <cylinderGeometry args={[r - 0.10, r - 0.10, 0.018, 64]} />
          <meshStandardMaterial color="#8FE3C0" transparent opacity={0.25}
            emissive="#8FE3C0" emissiveIntensity={1}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Logo cap */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[r - 0.18, r - 0.18, 0.04, 32]} />
        <meshPhysicalMaterial color={color} {...matProps} />
        <Decal position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[0.36, 0.36, 0.36]}>
          <meshStandardMaterial map={logoTex} color="#3D6B5A" transparent
            polygonOffset polygonOffsetFactor={-1} depthTest depthWrite={false} roughness={0.3} />
        </Decal>
      </mesh>
    </group>
  );
}
