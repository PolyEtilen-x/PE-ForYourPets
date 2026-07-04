'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PulseLine from '@/components/ui/pulse-line';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

export default function RevealSection() {
  const t = useTranslations('reveal');

  const [activeAngle, setActiveAngle] = useState<'left' | 'straight' | 'right'>('straight');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const ratio = x / width;

    if (ratio < 0.33) {
      setActiveAngle('left');
    } else if (ratio > 0.66) {
      setActiveAngle('right');
    } else {
      setActiveAngle('straight');
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveAngle('straight');
  }, []);

  return (
    <section className={styles.section}>
      {/* Radial glow background */}
      <div className={styles.radialGlow} />

      <div className={styles.container}>
        {/* Badge — slides in from left */}
        <ScrollReveal animation="slideInLeft" duration={600}>
          <div className={styles.badge}>{t('badge')}</div>
        </ScrollReveal>

        {/* Camera — float animation + interactive angles */}
        <ScrollReveal animation="springPop" delay={150} duration={800}>
          <div
            className={styles.cameraWrapper}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.cameraFloat}>
              <div className={styles.imageSequence}>
                <Image
                  src="/images/pe-camera-left.png"
                  alt="PE Camera Left View"
                  fill
                  sizes="(max-width: 768px) 250px, 400px"
                  style={{ objectFit: 'contain', opacity: activeAngle === 'left' ? 1 : 0, transition: 'opacity 0.15s ease' }}
                  priority
                />
                <Image
                  src="/images/pe-camera-straight.png"
                  alt="PE Camera Front View"
                  fill
                  sizes="(max-width: 768px) 250px, 400px"
                  style={{ objectFit: 'contain', opacity: activeAngle === 'straight' ? 1 : 0, transition: 'opacity 0.15s ease' }}
                  priority
                />
                <Image
                  src="/images/pe-camera-right.png"
                  alt="PE Camera Right View"
                  fill
                  sizes="(max-width: 768px) 250px, 400px"
                  style={{ objectFit: 'contain', opacity: activeAngle === 'right' ? 1 : 0, transition: 'opacity 0.15s ease' }}
                  priority
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Heading — line by line reveal with stagger */}
        <ScrollReveal animation="revealUp" delay={300} duration={800}>
          <h2 className={styles.heading}>
            {t('heading')}
            <em className={styles.accent}>{t('headingAccent')}</em>
          </h2>
        </ScrollReveal>

        {/* Body text — fade in after heading */}
        <ScrollReveal animation="revealFade" delay={500} duration={700}>
          <p className={styles.bodyText}>{t('body')}</p>
        </ScrollReveal>

        {/* Pulse line — decorative */}
        <ScrollReveal animation="revealFade" delay={700} duration={1000}>
          <div className={styles.pulseWrapper}>
            <PulseLine className={styles.pulseLine} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
