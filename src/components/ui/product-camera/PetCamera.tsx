'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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
// Không dùng Environment preset="studio" vì nó load HDR nặng (~500KB).
// Custom DirectionalLight + AmbientLight đủ đẹp và nhẹ hơn nhiều.
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
  const rootRef            = useRef<THREE.Group>(null);
  const turntableGroupRef  = useRef<THREE.Group>(null);
  const bodyGroupRef       = useRef<THREE.Group>(null);
  // For idle breathing without messing with rotation
  const bodyScaleGroupRef  = useRef<THREE.Group>(null);

  // Interaction & animation hooks
  const { turntableYaw, bodyPitch } = useCameraController(interactive);

  useIdleAnimation(
    { cameraGroupRef: rootRef, bodyGroupRef: bodyScaleGroupRef, turntableRef: turntableGroupRef },
    interactive,
  );

  // Apply rotations every frame — runs inside Canvas so THREE.MathUtils is safe
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
  interactive = true,
  enableZoom = true,
  enableRotate = true,
  className,
}: ProductCamera3DProps) {
  const colorHex = CAMERA_COLORS[color ?? 'sage'] ?? CAMERA_COLORS.sage;

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`} style={{ touchAction: 'none' }}>
      <Canvas
        className={styles.canvas}
        // "always" vì useIdleAnimation chạy liên tục mỗi frame.
        // "demand" sẽ freeze khi không có interaction.
        frameloop="always"
        // Cap DPR: mobile tối đa 1.5, desktop 2 — tránh render 4× pixel trên Retina màn.
        // [min, max] — R3F chọn Math.min(window.devicePixelRatio, max).
        dpr={[1, 1.5]}
        shadows={false}  // Shadow map tốn 10–30ms/frame — tắt vì lights đủ đẹp
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          // Tắt depth buffer precision cao không cần thiết cho product viewer
          precision: 'mediump',
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

        {/* OrbitControls — chỉ dùng cho zoom, KHÔNG xoay scene toàn cục. */}
        <OrbitControls
          enableDamping={CONTROLS.DAMPING}
          dampingFactor={CONTROLS.DAMPING_FACTOR}
          enableZoom={enableZoom}
          enableRotate={false}   // Xoay được xử lý bởi useCameraController
          enablePan={false}
          autoRotate={false}     // Handled by useIdleAnimation
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
