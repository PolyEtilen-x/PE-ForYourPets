'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GEOMETRY, DIMENSIONS } from '../constants';

interface BodyProps {
  color: string;
}

/**
 * Body — clay reference: smooth sphere, NO visible UV seam.
 *
 * Single SphereGeometry (64×64 segments) with vertex deformation.
 * frontFlattenRatio=0.08 pushes front hemisphere vertices inward:
 *   for each vertex with z > 0:  newZ = z * (1 - 0.08 * (z/R))
 *
 * The seam: a thin Torus geometry ring at the equator (Y=0).
 */
export default function Body({ color }: BodyProps) {
  const R       = GEOMETRY.BODY_SPHERE_RADIUS;          // 2.75
  const flatten = DIMENSIONS.body.frontFlattenRatio;    // 0.08

  const bodyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(R, 64, 64);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      if (z > 0) {
        const t = z / R; // 0..1
        pos.setZ(i, z * (1 - flatten * t));
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [R, flatten]);

  return (
    <group>
      {/* Deformed sphere body */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.38}
          clearcoat={0.18}
          clearcoatRoughness={0.12}
          metalness={0.04}
        />
      </mesh>

      {/* Equatorial mold seam — thin torus ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R * 0.995, 0.014, 12, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
    </group>
  );
}
