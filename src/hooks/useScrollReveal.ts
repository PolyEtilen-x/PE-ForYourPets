'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollRevealOptions {
  /**
   * Fraction of element visible to trigger (0–1).
   * Default: 0.12 — trigger early for smoother feel
   */
  threshold?: number;
  /**
   * Expand root margin to pre-trigger slightly before entering viewport.
   * Default: '-40px' — small negative so animation starts just as element enters
   */
  rootMargin?: string;
  /**
   * If true, only reveal once (default). If false, toggles on scroll in/out.
   */
  once?: boolean;
  /**
   * Delay before setting revealed state (ms). Useful for stagger orchestration.
   */
  delay?: number;
}

interface UseScrollRevealReturn {
  ref: React.RefObject<HTMLElement | null>;
  isRevealed: boolean;
}

export function useScrollReveal({
  threshold = 0.12,
  rootMargin = '-40px',
  once = true,
  delay = 0,
}: UseScrollRevealOptions = {}): UseScrollRevealReturn {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    // Defer setState out of sync effect body using rAF
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(() => setIsRevealed(true));
      return () => cancelAnimationFrame(raf);
    }

    const element = ref.current;
    if (!element) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => setIsRevealed(true), delay);
          } else {
            setIsRevealed(true);
          }
          if (once) observer.disconnect();
        } else if (!once) {
          clearTimeout(timeoutId);
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [threshold, rootMargin, once, delay, prefersReducedMotion]);

  return { ref, isRevealed };
}
