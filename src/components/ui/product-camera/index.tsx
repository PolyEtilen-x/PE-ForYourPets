'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { ProductCamera3DProps } from './types';

// Re-export SVG component and its types for backward compatibility
// (RevealSection and spec-grid still use the SVG version)
export { default as ProductCameraSvg, CAM_COLORS } from './ProductCameraSvg';
export type { ColorKey } from './ProductCameraSvg';

// The 3D scene is heavy — never include in initial bundle.
// Load only on client, only when component enters the viewport.
const PetCamera = dynamic(() => import('./PetCamera'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', aspectRatio: '1 / 1' }} />,
});

/**
 * ProductCamera3D — premium 3D product visualization.
 *
 * Uses IntersectionObserver to delay WebGL context initialization
 * until the component is actually visible, protecting Lighthouse LCP.
 */
export default function ProductCamera3D(props: ProductCamera3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      // Start loading slightly before visible (100px margin)
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    >
      {isVisible && <PetCamera {...props} />}
    </div>
  );
}
