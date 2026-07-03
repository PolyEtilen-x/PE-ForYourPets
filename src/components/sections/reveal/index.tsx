'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ProductCamera from '@/components/ui/product-camera';
import PulseLine from '@/components/ui/pulse-line';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

export default function RevealSection() {
  const t = useTranslations('reveal');

  return (
    <section className={styles.section}>
      {/* Radial glow background */}
      <div className={styles.radialGlow} />

      <div className={styles.container}>
        {/* Badge — slides in from left */}
        <ScrollReveal animation="slideInLeft" duration={600}>
          <div className={styles.badge}>{t('badge')}</div>
        </ScrollReveal>

        {/* Camera — float animation + scroll reveal (springPop) */}
        <ScrollReveal animation="springPop" delay={150} duration={800}>
          <div className={styles.cameraWrapper}>
            <div className={styles.cameraFloat}>
              <ProductCamera colorKey="sage" rotation={18} />
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
