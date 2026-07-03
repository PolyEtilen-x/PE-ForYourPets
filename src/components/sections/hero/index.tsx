'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PulseLine from '@/components/ui/pulse-line';
import { ChevronDown } from 'lucide-react';
import styles from './style.module.css';

export default function HeroSection() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Parallax: bg image moves slower than scroll (factor 0.35)
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const updateParallax = () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      if (!section || !bg) return;

      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = rect.top / viewportH;
      const offset = Math.max(-80, Math.min(80, progress * viewportH * 0.35));
      bg.style.transform = `translateY(${offset}px) scale(1.1)`;
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
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Parallax bg wrapper */}
      <div ref={bgRef} className={styles.bgWrapper}>
        <Image
          src="/images/hero-bg.webp"
          alt="A cat resting peacefully near a warm window"
          fill
          priority
          sizes="100vw"
          quality={85}
          className={styles.bgImage}
          fetchPriority="high"
        />
      </div>

      {/* Gradient overlay */}
      <div className={styles.overlay} />

      {/* Decorative pulse line */}
      <div className={styles.pulseContainer}>
        <PulseLine className={styles.pulseLine} />
      </div>

      {/* Content wrapper — entrance animations via CSS keyframes */}
      <div className={styles.content}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.headline}>
          {t('headline')}
          <em className={styles.accent}>{t('headlineAccent')}</em>
          {t('headlineEnd')}
        </h1>
        <p className={styles.subheadline}>{t('subheadline')}</p>
      </div>

      {/* Scroll indicator hint */}
      <a href="#features" className={styles.scrollHint}>
        <span>{t('scrollHint')}</span>
        <ChevronDown size={15} />
      </a>
    </section>
  );
}
