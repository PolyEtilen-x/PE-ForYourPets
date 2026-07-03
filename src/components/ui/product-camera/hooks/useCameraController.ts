import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface CameraRotationState {
  turntableYaw: React.MutableRefObject<number>;
  bodyPitch: React.MutableRefObject<number>;
}

export function useCameraController(interactive = true): CameraRotationState {
  const { gl } = useThree();

  const turntableYaw = useRef(0);
  const bodyPitch    = useRef(0);
  const targetYaw    = useRef(0);
  const targetPitch  = useRef(0);

  const isDragging   = useRef(false);
  const lastPos      = useRef({ x: 0, y: 0 });
  const velocity     = useRef({ x: 0, y: 0 });

  // Tăng sensitivity để kéo nhanh hơn nữa
  const DRAG_SENSITIVITY = 0.018;
  const PITCH_LIMIT      = Math.PI / 4; // ±45°

  useEffect(() => {
    if (!interactive) return;

    const el = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastPos.current    = { x: e.clientX, y: e.clientY };
      velocity.current   = { x: 0, y: 0 };
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      velocity.current = { x: dx, y: dy };

      targetYaw.current   -= dx * DRAG_SENSITIVITY;
      targetPitch.current -= dy * DRAG_SENSITIVITY;
      targetPitch.current  = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, targetPitch.current));

      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false;
      el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup',   onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup',   onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl, interactive]);

  useFrame((_state, delta) => {
    // Inertia khi thả tay — decay nhanh hơn (0.80 thay vì 0.90)
    if (!isDragging.current) {
      targetYaw.current   -= velocity.current.x * 0.008;
      targetPitch.current -= velocity.current.y * 0.008;
      targetPitch.current  = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, targetPitch.current));

      velocity.current.x *= 0.80;
      velocity.current.y *= 0.80;
    }

    // Damping cao hơn (11 / 9 → mượt nhưng cực kỳ responsive; trước là 8 / 7)
    turntableYaw.current = THREE.MathUtils.damp(turntableYaw.current, targetYaw.current, 11, delta);
    bodyPitch.current    = THREE.MathUtils.damp(bodyPitch.current, targetPitch.current, 9, delta);
  });

  return { turntableYaw, bodyPitch };
}
