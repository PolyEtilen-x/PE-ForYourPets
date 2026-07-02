'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseParallaxOptions {
  /**
   * Speed factor: how much the element moves relative to scroll.
   * 0.2 = subtle, 0.5 = medium, 0.8 = strong.
   * Negative values invert the direction.
   * Default: 0.25
   */
  factor?: number;
  /**
   * Axis of movement. Default: 'y'
   */
  axis?: 'y' | 'x';
  /**
   * Optional: clamp the max offset (px). Default: 80
   */
  maxOffset?: number;
}

/**
 * useParallax — rAF-based parallax offset calculation.
 *
 * Uses requestAnimationFrame for smooth 60fps updates.
 * Automatically disabled when `prefers-reduced-motion: reduce` is set.
 * Returns inline style object to spread onto an element.
 *
 * @example
 * const { style } = useParallax({ factor: 0.3 });
 * <div style={style}>Background image</div>
 */
export function useParallax({ factor = 0.25, axis = 'y', maxOffset = 80 }: UseParallaxOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const updateParallax = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Progress from 1 (element at bottom of viewport) to 0 (at top)
      const progress = rect.top / viewportHeight;

      // Calculate offset: positive = moves down when scrolling
      const rawOffset = progress * viewportHeight * factor;
      const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));

      setOffset(clampedOffset);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Initial position

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [factor, axis, maxOffset, prefersReducedMotion]);

  const style: React.CSSProperties = {
    transform: axis === 'y' ? `translateY(${offset}px)` : `translateX(${offset}px)`,
    willChange: 'transform',
  };

  return { containerRef, style };
}
