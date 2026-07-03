'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ProductCamera3DProps } from './types';
import { SCENE, LIGHTING, CONTROLS, ASSEMBLY, CAMERA_COLORS } from './constants';

import Base from './parts/Base';
import Turntable from './parts/Turntable';
import Yoke from './parts/Yoke';
import Pivot from './parts/Pivot';
import Body from './parts/Body';
import FrontGlass from './parts/FrontGlass';
import Lens from './parts/Lens';
import StatusLed from './parts/StatusLed';
import styles from './style.module.css';

import { useCameraController } from './hooks/useCameraController';
import { useIdleAnimation } from './hooks/useIdleAnimation';

// --- Studio lighting rig (3-point: key + fill + rim) ---
function StudioLighting() {
  return (
    <>
      <directionalLight position={LIGHTING.KEY_POSITION} intensity={LIGHTING.KEY_INTENSITY} castShadow />
      <directionalLight position={LIGHTING.FILL_POSITION} intensity={LIGHTING.FILL_INTENSITY} />
      <directionalLight position={LIGHTING.RIM_POSITION} intensity={LIGHTING.RIM_INTENSITY} color="#c8e0ff" />
      <ambientLight intensity={LIGHTING.AMBIENT_INTENSITY} />
    </>
  );
}

// --- Assembled camera model ---
// Hierarchy:
//   PetCameraModel (group)
//     Base (Fixed)
//     TurntableGroup (Yaw rotation)
//       Turntable
//       Yoke
//       Pivot
//       BodyGroup (Pitch rotation)
//         Body
//         FrontGlass
//         Lens
//         StatusLed
interface PetCameraModelProps {
  color: string;
  interactive: boolean;
}

function PetCameraModel({ color, interactive }: PetCameraModelProps) {
  // References for mechanical groups
  const rootRef = useRef<THREE.Group>(null);
  const turntableGroupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const bodyScaleGroupRef = useRef<THREE.Group>(null); // For idle breathing without messing with rotation

  // Interaction Hooks
  const { turntableYaw, bodyPitch } = useCameraController(interactive);
  
  useIdleAnimation({
    cameraGroupRef: rootRef,
    bodyGroupRef: bodyScaleGroupRef,
    turntableRef: turntableGroupRef,
  }, interactive);

  // Apply rotations every frame
  useFrame(() => {
    if (turntableGroupRef.current) {
      turntableGroupRef.current.rotation.y = turntableYaw.current;
    }
    if (bodyGroupRef.current) {
      bodyGroupRef.current.rotation.x = bodyPitch.current;
    }
  });

  return (
    <group ref={rootRef}>
      {/* 1. Base - ALWAYS fixed to the ground */}
      <Base color={color} />

      {/* 2. Turntable Group - Handles Yaw (Y-axis rotation) */}
      <group ref={turntableGroupRef}>
        <Turntable color={color} />
        <Yoke color={color} />
        <Pivot color={color} />

        {/* 3. Body Group — pitches around body center (PIVOT_Y = BODY_Y) */}
        <group position={[0, ASSEMBLY.PIVOT_Y, 0]} ref={bodyGroupRef}>
          {/* Local offset = 0 since pivot IS the body center */}
          <group ref={bodyScaleGroupRef}>
            <Body color={color} />
            <FrontGlass />
            <Lens />
            <StatusLed />
          </group>
        </group>
      </group>
    </group>
  );
}

// --- Canvas wrapper ---
export default function PetCamera({
  color = 'sage',
  autoRotate = false,
  interactive = true,
  enableZoom = true,
  enableRotate = true, // We will not use this for OrbitControls anymore, it's for custom interaction
  className,
}: ProductCamera3DProps) {
  const colorHex = CAMERA_COLORS[color ?? 'sage'] ?? CAMERA_COLORS.sage;

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`} style={{ touchAction: 'none' }}>
      <Canvas
        className={styles.canvas}
        frameloop="demand"
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <PerspectiveCamera
          makeDefault
          fov={SCENE.FOV}
          near={SCENE.NEAR}
          far={SCENE.FAR}
          position={SCENE.CAMERA_POSITION}
        />

        <StudioLighting />
        <Environment preset="studio" />

        {/* OrbitControls - ROTATION DISABLED. Only handles zoom/pan if needed. */}
        <OrbitControls
          enableDamping={CONTROLS.DAMPING}
          dampingFactor={CONTROLS.DAMPING_FACTOR}
          enableZoom={enableZoom}
          enableRotate={false} // NEVER rotate the scene globally
          enablePan={false}
          autoRotate={false}   // Handled by custom idle hooks
          minDistance={SCENE.ZOOM_RANGE[0]}
          maxDistance={SCENE.ZOOM_RANGE[1]}
        />

        <Suspense fallback={null}>
          <PetCameraModel color={colorHex} interactive={interactive && enableRotate} />
        </Suspense>
      </Canvas>
    </div>
  );
}
