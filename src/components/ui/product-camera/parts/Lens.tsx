'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ASSEMBLY, GEOMETRY } from '../constants';

/**
 * Lens — concentric recessed rings per clay reference.
 *
 * LatheGeometry with stepped profile, spun around Y-axis.
 * Profile points: [radius, Y_depth] — positive Y = toward camera (front face),
 * negative Y = recessed into body.
 *
 * Because LatheGeometry revolves around Y, we DON'T rotate the mesh.
 * Instead we make the profile go from the outer edge down INTO Y-negative.
 * Then we rotate the whole group so -Y points toward the body (+Z in world).
 * Actually: simpler to just use Y as depth and rotation={[Math.PI/2, 0, 0]}
 * which maps: Y(profile depth) → +Z(world), X(profile radius) → X(world).
 *
 * Spec radii:
 *   outer = 1.30 cm
 *   mid   = 0.95 cm
 *   glass = 0.60 cm
 *   pupil = 0.18 cm
 */
export default function Lens() {
  const Z      = ASSEMBLY.LENS_Z;
  const outerR = GEOMETRY.LENS_CHROME_OUTER;  // 1.30
  const midR   = GEOMETRY.LENS_CHROME_INNER;  // 0.95
  const glassR = GEOMETRY.LENS_GLASS_R;       // 0.60
  const pupilR = GEOMETRY.LENS_PUPIL_R;       // 0.18

  // Profile in LatheGeometry XY space.
  // After rotation [Math.PI/2, 0, 0]: X→X, Y→Z (depth into body)
  // We use Y as depth into the body (negative = recessed)
  const housingGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(outerR,         0.00),  // outer edge at face
      new THREE.Vector2(outerR,        -0.08),  // outer ring wall
      new THREE.Vector2(outerR - 0.10, -0.12),  // outer bevel
      new THREE.Vector2(midR  + 0.06,  -0.16),  // shelf to mid ring
      new THREE.Vector2(midR  + 0.06,  -0.24),  // mid ring outer wall
      new THREE.Vector2(midR,          -0.28),  // mid ring inner bevel
      new THREE.Vector2(midR,          -0.36),  // mid ring floor
      new THREE.Vector2(glassR + 0.12, -0.40),  // shelf to glass
      new THREE.Vector2(glassR + 0.12, -0.48),  // glass surround wall
      new THREE.Vector2(glassR,        -0.52),  // glass edge
      new THREE.Vector2(glassR,        -0.62),  // glass depth
      new THREE.Vector2(pupilR,        -0.68),  // iris taper
      new THREE.Vector2(pupilR,        -0.86),  // sensor hole
      new THREE.Vector2(0,             -0.86),  // center
    ];
    return new THREE.LatheGeometry(pts, 64);
  }, [outerR, midR, glassR, pupilR]);

  return (
    // Z is the forward offset from body center (LENS_Z ≈ 1.68)
    // rotation [π/2, 0, 0] maps the LatheGeometry's -Y (depth) → +Z (into body)
    <group position={[0, 0, Z]} rotation={[-Math.PI / 2, 0, 0]}>

      {/* Main stepped lens housing */}
      <mesh geometry={housingGeo} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer chrome lip ring */}
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[outerR - 0.05, 0.055, 24, 64]} />
        <meshPhysicalMaterial color="#141414" roughness={0.05} clearcoat={1.0} metalness={0.75} />
      </mesh>

      {/* Mid ring lip accent */}
      <mesh position={[0, -0.27, 0]}>
        <torusGeometry args={[midR - 0.02, 0.028, 16, 64]} />
        <meshStandardMaterial color="#0e0e0e" roughness={0.30} metalness={0.5} />
      </mesh>

      {/* Convex glass dome (physical transmission) */}
      <mesh position={[0, -0.50, 0]}>
        {/* SphereGeometry cap opening toward +Y (after rotation → toward -Z = outward) */}
        <sphereGeometry args={[glassR + 0.14, 32, 32, 0, Math.PI * 2, Math.PI * 0.7, Math.PI * 0.3]} />
        <meshPhysicalMaterial
          color="#ddeeff"
          transmission={1.0}
          ior={1.52}
          thickness={0.20}
          roughness={0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Iris AR ring */}
      <mesh position={[0, -0.66, 0]}>
        <cylinderGeometry args={[pupilR + 0.07, pupilR, 0.025, 48]} />
        <meshPhysicalMaterial color="#050518" emissive="#03031a"
          emissiveIntensity={0.6} roughness={0.06} metalness={0.9} clearcoat={1.0} />
      </mesh>

      {/* Sensor hole */}
      <mesh position={[0, -0.80, 0]}>
        <cylinderGeometry args={[pupilR, pupilR, 0.12, 24]} />
        <meshStandardMaterial color="#000000" roughness={0} />
      </mesh>
    </group>
  );
}
