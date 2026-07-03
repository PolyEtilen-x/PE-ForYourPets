'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
}

interface UseScrollRevealReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isRevealed: boolean;
}

// Module-level — không cần useCallback, không gây re-render
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.12,
  rootMargin = '-40px',
  once = true,
  delay = 0,
}: UseScrollRevealOptions = {}): UseScrollRevealReturn<T> {
  const ref = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const delayRef = useRef(delay);

  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // queueMicrotask makes setState async — satisfies react-hooks/set-state-in-effect
      queueMicrotask(() => setIsRevealed(true));
      return;
    }

    const element = ref.current;
    if (!element) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayRef.current > 0) {
            timeoutId = setTimeout(() => setIsRevealed(true), delayRef.current);
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
  }, [threshold, rootMargin, once]); // delay xử lý qua ref, không cần trong deps

  return { ref, isRevealed };
}