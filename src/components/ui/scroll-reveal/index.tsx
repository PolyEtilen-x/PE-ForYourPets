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

/**
 * ScrollReveal — wraps any content and transitions it into view when
 * scrolled into the viewport. Optimized using GPU transitions and
 * automatic will-change layer cleanup to protect memory on mobile devices.
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

  useEffect(() => {
    // Reduced motion: skip animation, show content immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      queueMicrotask(() => setIsRevealed(true));
      return;
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
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '-20px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, delay]);

  const animClass = styles[animation] ?? '';
  const revealedClass = isRevealed ? (revealedClassName ?? styles.revealed) : styles.hidden;
  const TagComponent = Tag as unknown as React.ComponentType<{
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLElement | null>;
  }>;

  return (
    <TagComponent
      ref={ref}
      className={`${styles.base} ${animClass} ${revealedClass} ${className}`.trim()}
      style={{ '--reveal-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
    </TagComponent>
  );
}
