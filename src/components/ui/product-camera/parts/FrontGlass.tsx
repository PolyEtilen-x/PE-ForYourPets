'use client';

import React from 'react';
import { GEOMETRY } from '../constants';

/**
 * FrontGlass — recessed circular glass panel on front of body sphere.
 *
 * Key insight: The bezel ring is NOT a free-standing torus floating in space.
 * It is a ring that lies ON the sphere surface at the glass edge circle.
 *
 * Sphere surface at radius r from center (in XY plane) has Z = sqrt(R²-r²).
 * For glass circle r=2.1: Z = sqrt(2.75²-2.1²) ≈ 1.78
 *
 * The black spherical cap for the glass face is a partial sphere from
 * thetaLens (lens opening) to thetaGlass (glass edge).
 */
export default function FrontGlass() {
  const bodyR  = GEOMETRY.BODY_SPHERE_RADIUS;  // 2.75
  const glassR = GEOMETRY.FRONT_FACE_RADIUS;   // 2.1
  const lensR  = GEOMETRY.LENS_CHROME_OUTER;   // 1.3

  // Polar angles (from +Z pole after rotation)
  const thetaGlass = Math.asin(glassR / bodyR);    // ≈ 0.869 rad — glass edge
  const thetaLens  = Math.asin(lensR  / bodyR);    // ≈ 0.490 rad — lens opening

  // Z coordinates on sphere surface
  const faceZ  = bodyR * Math.cos(thetaGlass);     // ≈ 1.81 — glass edge Z

  return (
    <group>
      {/* 1. Black spherical cap (the glass face — ring from lens hole to glass edge) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry
          args={[bodyR, 64, 64, 0, Math.PI * 2, thetaLens, thetaGlass - thetaLens]}
        />
        <meshPhysicalMaterial
          color="#030303"
          roughness={0.03}
          metalness={0.5}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          ior={1.5}
        />
      </mesh>

      {/* 2. Bezel ring — sits flush on sphere surface at glass edge
           Uses a TorusGeometry with small tube radius to avoid the "two arcs" artifact.
           The center of the torus circle matches the glass edge circle on the sphere.
           Position it at faceZ on the Z axis. */}
      <mesh position={[0, 0, faceZ]}>
        <torusGeometry args={[glassR, 0.045, 24, 64]} />
        <meshPhysicalMaterial color="#f0f0f0" roughness={0.38} clearcoat={0.12} metalness={0.04} />
      </mesh>

      {/* 3. Very thin assembly gap hairline */}
      <mesh position={[0, 0, faceZ - 0.05]}>
        <torusGeometry args={[glassR + 0.055, 0.018, 12, 64]} />
        <meshStandardMaterial color="#111" roughness={0.95} />
      </mesh>
    </group>
  );
}
