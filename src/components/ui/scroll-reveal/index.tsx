'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './style.module.css';

type AnimationVariant =
  | 'revealUp'
  | 'revealFade'
  | 'slideInLeft'
  | 'slideInRight'
  | 'scaleIn'
  | 'springPop';

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Animation variant to play when element enters viewport */
  animation?: AnimationVariant;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Duration override (ms). Defaults to 700ms */
  duration?: number;
  /** Custom className to add when revealed */
  revealedClassName?: string;
  /** IntersectionObserver threshold (0–1) */
  threshold?: number;
  /** As prop — renders as this HTML element. Default: 'div' */
  as?: React.ElementType;
  className?: string;
}

/**
 * ScrollReveal — wraps any content and animates it into view when
 * scrolled into the viewport. Zero dependencies, pure CSS animations.
 */
export default function ScrollReveal({
  children,
  animation = 'revealUp',
  delay = 0,
  duration = 700,
  revealedClassName,
  threshold = 0.12,
  as: Tag = 'div',
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    // Use rAF to defer setState out of synchronous effect body
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
          timeoutId = setTimeout(() => setIsRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '-30px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delay, threshold, prefersReducedMotion]);

  const animClass = styles[animation] ?? '';
  const revealedClass = isRevealed ? (revealedClassName ?? styles.revealed) : styles.hidden;

  return (
    <Tag
      ref={ref}
      className={`${styles.base} ${animClass} ${revealedClass} ${className}`.trim()}
      style={{ '--reveal-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
