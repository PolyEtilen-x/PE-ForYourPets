import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface IdleAnimationRefs {
  cameraGroupRef: React.RefObject<THREE.Group | null>; // For floating
  bodyGroupRef: React.RefObject<THREE.Group | null>;   // For breathing (scaling)
  turntableRef: React.RefObject<THREE.Group | null>;   // For idle rotation
}

export function useIdleAnimation({ cameraGroupRef, bodyGroupRef, turntableRef }: IdleAnimationRefs, isInteractive = true) {
  const time = useRef(0);

  useFrame((state, delta) => {
    // If interactive and pointer is active, we might want to pause idle, 
    // but a subtle idle is always nice. We'll just keep it very subtle.
    time.current += delta;

    // 1. Subtle float of the entire assembly (simulate resting softly or just "alive")
    if (cameraGroupRef.current) {
      cameraGroupRef.current.position.y = Math.sin(time.current * 1.5) * 0.005;
    }

    // 2. Subtle breathing (micro scaling of the body)
    if (bodyGroupRef.current) {
      const breath = 1.0 + Math.sin(time.current * 2) * 0.002;
      // Note: we only scale Y and Z to simulate lung expansion, or all axis.
      bodyGroupRef.current.scale.set(breath, breath, breath);
    }

    // 3. Gentle idle rotation of the Turntable (Yaw only)
    if (turntableRef.current && !isInteractive) {
      // If we are completely idle (autoRotate), we can slowly spin the turntable.
      // If interactive, we leave turntable rotation to the CameraController hook.
    }
  });
}
