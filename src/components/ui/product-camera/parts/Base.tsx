'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture, Text } from '@react-three/drei';
import { ASSEMBLY, GEOMETRY } from '../constants';

interface BaseProps {
  color: string;
}

/**
 * Base — clay reference analysis:
 * - FRUSTUM: wide at bottom, narrower at top (top ≈ turntable radius)
 * - Max radius (2.75) occurs near the BOTTOM, gently tapers UP to 2.3
 * - Very small foot bevel at extreme bottom (sharp chamfer)
 * - Rounded top edge blending into turntable
 *
 * LatheGeometry profile (radius, Y from base bottom):
 *   Y=0.00   r=0.65   foot bottom
 *   Y=0.22   r=2.75   max radius (end of foot bevel)
 *   Y=0.40   r=2.75   short flat ledge
 *   Y=2.20   r=2.52   gentle mid taper
 *   Y=3.40   r=2.33   approaching top
 *   Y=3.67   r=2.30   top (matches turntable radius)
 */
export default function Base({ color }: BaseProps) {
  const logoTex = useTexture('/logo_noname.png');

  const baseH = ASSEMBLY.BASE_HEIGHT;         // 3.675
  const rTop  = GEOMETRY.BASE_RADIUS_TOP;     // 2.3
  const rMax  = GEOMETRY.BASE_RADIUS_BOTTOM;  // 2.75
  const rFoot = GEOMETRY.BASE_FOOT_RADIUS;    // 0.65

  const matProps = { roughness: 0.38, clearcoat: 0.12, clearcoatRoughness: 0.25, metalness: 0.04 };

  const latheGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(rFoot,       0.00),          // foot bottom
      new THREE.Vector2(rMax,        0.22),          // foot bevel end
      new THREE.Vector2(rMax,        0.40),          // flat ledge
      new THREE.Vector2(rMax - 0.10, 0.80),          // very slight upper curve begins
      new THREE.Vector2(2.60,        baseH * 0.50),  // mid gentle taper
      new THREE.Vector2(2.40,        baseH * 0.80),
      new THREE.Vector2(rTop + 0.04, baseH - 0.15),
      new THREE.Vector2(rTop,        baseH),          // top edge
    ];
    const geo = new THREE.LatheGeometry(pts, 64);
    return geo;
  }, [baseH, rTop, rMax, rFoot]);

  return (
    <group position={[0, ASSEMBLY.BASE_BOTTOM_Y, 0]}>

      {/* Rubber feet ×4 */}
      {[0, 1, 2, 3].map((i) => {
        const a = i * (Math.PI / 2) + Math.PI / 4;
        const fr = rMax - 0.45;
        return (
          <mesh key={i} position={[Math.cos(a) * fr, 0, Math.sin(a) * fr]}>
            <cylinderGeometry args={[0.18, 0.15, 0.07, 16]} />
            <meshStandardMaterial color="#333" roughness={0.98} />
          </mesh>
        );
      })}

      {/* LED ring — near foot bevel (spec: near bottom edge) */}
      <group position={[0, 0.24, 0]}>
        <mesh>
          <torusGeometry args={[rMax - 0.02, 0.038, 16, 64]} />
          <meshStandardMaterial color="#A1E8CC" emissive="#A1E8CC" emissiveIntensity={3.0} />
        </mesh>
        <mesh>
          <torusGeometry args={[rMax - 0.02, 0.100, 12, 64]} />
          <meshStandardMaterial color="#8FE3C0" transparent opacity={0.20}
            emissive="#8FE3C0" emissiveIntensity={1.2}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Main base body */}
      <mesh geometry={latheGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} {...matProps} />
      </mesh>

      {/* Logo on front face */}
      <group position={[0, baseH * 0.38, rMax * 0.990]}>
        <mesh rotation={[0, 0, 0]}>
          <planeGeometry args={[1.10, 0.45]} />
          <meshStandardMaterial map={logoTex} transparent alphaTest={0.05}
            color="#3D6B5A" roughness={0.5} depthWrite={false} />
        </mesh>
      </group>

      {/* Brand text */}
      <Text
        position={[0, baseH * 0.21, rMax * 0.990]}
        fontSize={0.21}
        color="#3D6B5A"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.01}
      >
        PE-ForYourPets
      </Text>

      {/* Seam step at top — visible groove where turntable begins */}
      <mesh position={[0, baseH + 0.03, 0]}>
        <cylinderGeometry args={[rTop - 0.06, rTop + 0.04, 0.06, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
    </group>
  );
}
