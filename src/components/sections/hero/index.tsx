import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PulseLine from '@/components/ui/pulse-line';
import { ChevronDown } from 'lucide-react';
import styles from './style.module.css';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className={styles.hero}>
      {/* Full-bleed Optimized Next/Image */}
      <Image
        src="/images/hero-bg.webp"
        alt="A cat resting peacefully near a warm window"
        fill
        priority
        sizes="100vw"
        className={styles.bgImage}
      />
      {/* Gradient overlay */}
      <div className={styles.overlay} />

      {/* Decorative pulse line */}
      <div className={styles.pulseContainer}>
        <PulseLine className={styles.pulseLine} />
      </div>

      {/* Content wrapper */}
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
