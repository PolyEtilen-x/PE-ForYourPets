'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ASSEMBLY, GEOMETRY } from '../constants';

interface YokeProps {
  color: string;
}

/**
 * GimbalArm — clay reference analysis:
 * From image 2 (rear view): the arm is a FLAT BRACKET with visible thickness.
 * From image 1, 3 (side/front): appears as a solid curved arm.
 *
 * Implementation: ExtrudeGeometry with a rounded-rectangle cross-section.
 * Cross-section: 1.0 cm wide (X) × 0.65 cm deep (Z) — rectangular with bevel.
 * Path: L-shape — horizontal from turntable edge → then vertical up to pivot.
 *
 * This gives:
 * - From front: visible as 1.0cm wide arm
 * - From side: visible as 0.65cm deep arm (NOT a thin line)
 * - From rear: visible as flat bracket shape (matches image 2)
 */
export default function Yoke({ color }: YokeProps) {
  const px      = ASSEMBLY.PIVOT_X;          // 2.61
  const py      = ASSEMBLY.PIVOT_Y;          // 2.625
  const tTop    = ASSEMBLY.TURNTABLE_TOP;    // -0.375

  const armW = 0.90; // arm cross-section width (half = 0.45)
  const armD = 0.60; // arm cross-section depth (half = 0.30)
  const rad  = 0.15; // corner rounding

  const { armGeo, capGeo } = useMemo(() => {
    // Cross-section: rounded rectangle in local XY plane of extrusion
    const shape = new THREE.Shape();
    const hw = armW / 2;
    const hd = armD / 2;
    shape.moveTo(-hw + rad, -hd);
    shape.lineTo(hw - rad,  -hd);
    shape.quadraticCurveTo(hw,  -hd, hw,  -hd + rad);
    shape.lineTo(hw,   hd - rad);
    shape.quadraticCurveTo(hw,   hd, hw - rad,  hd);
    shape.lineTo(-hw + rad,  hd);
    shape.quadraticCurveTo(-hw,  hd, -hw, hd - rad);
    shape.lineTo(-hw, -hd + rad);
    shape.quadraticCurveTo(-hw, -hd, -hw + rad, -hd);

    // Path: start at turntable edge, horizontal to pivot X, then up to pivot Y
    // We split into two segments:
    //   1. Horizontal: from turntableEdgeX to px at Y=tTop
    //   2. Vertical:   from tTop to py at X=px
    // Corner is blended with a QuadraticBezier

    const cornerR = 0.60; // rounding at the L-joint corner
    const path = new THREE.CurvePath<THREE.Vector3>();

    // Start: slightly inside turntable edge
    const startX = GEOMETRY.TURNTABLE_RADIUS * 0.60; // 1.38
    const startY = tTop + armW * 0.5 + 0.05;

    path.add(new THREE.LineCurve3(
      new THREE.Vector3(startX, startY, 0),
      new THREE.Vector3(px - cornerR, startY, 0),
    ));
    path.add(new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(px - cornerR, startY, 0),
      new THREE.Vector3(px, startY, 0),
      new THREE.Vector3(px, startY + cornerR, 0),
    ));
    path.add(new THREE.LineCurve3(
      new THREE.Vector3(px, startY + cornerR, 0),
      new THREE.Vector3(px, py, 0),
    ));

    const armGeo = new THREE.ExtrudeGeometry(shape, {
      extrudePath: path,
      steps: 80,
      bevelEnabled: false,
    });

    // Round end-cap at the pivot connection
    const capGeo = new THREE.SphereGeometry(armW / 2, 16, 16, 0, Math.PI);

    return { armGeo, capGeo };
  }, [px, py, tTop, armW, armD, rad]);

  const matProps = {
    color,
    roughness: 0.38,
    clearcoat: 0.12,
    clearcoatRoughness: 0.25,
    metalness: 0.04,
  };

  return (
    <group>
      <mesh geometry={armGeo} castShadow receiveShadow>
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
}
