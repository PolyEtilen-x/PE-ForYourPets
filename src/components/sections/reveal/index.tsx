'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ProductCamera from '@/components/ui/product-camera';
import PulseLine from '@/components/ui/pulse-line';
import styles from './style.module.css';

export default function RevealSection() {
  const t = useTranslations('reveal');

  return (
    <section className={styles.section}>
      {/* Radial glow background */}
      <div className={styles.radialGlow} />

      <div className={styles.container}>
        <div className={styles.badge}>{t('badge')}</div>

        <div className={styles.cameraWrapper}>
          <ProductCamera colorKey="sage" rotation={18} />
        </div>

        <h2 className={styles.heading}>
          {t('heading')}
          <em className={styles.accent}>{t('headingAccent')}</em>
        </h2>
        <p className={styles.bodyText}>{t('body')}</p>

        <div className={styles.pulseWrapper}>
          <PulseLine className={styles.pulseLine} />
        </div>
      </div>
    </section>
  );
}
