'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  animation?: AnimationVariant;
  delay?: number;
  duration?: number;
  revealedClassName?: string;
  threshold?: number;
  as?: React.ElementType;
  className?: string;
}

// Module-level — same pattern as useScrollReveal, no useCallback needed
const checkReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * ScrollReveal — wraps any content and animates it into view when
 * scrolled into the viewport. Zero dependencies, pure CSS animations.
 *
 * @example
 * <ScrollReveal animation="revealUp" delay={200}>
 *   <h2>Our Features</h2>
 * </ScrollReveal>
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
  // Generic ref — HTMLElement covers all HTML element subtypes
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const delayRef = useRef(delay);

  // Keep delayRef current without causing observer to re-run
  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

  useEffect(() => {
    // Reduced motion: skip animation, show content immediately
    if (checkReducedMotion()) {
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
  }, [threshold]); // delay → delayRef, duration/animation don't affect observer

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
