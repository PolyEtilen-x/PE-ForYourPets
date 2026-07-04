'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

export default function CinematicVideoSection() {
  return (
    <section className={styles.section}>
      <ScrollReveal animation="revealUp" duration={1000}>
        <div className={styles.videoWrapper}>
          <video
            src="/videos/Video-Project-compressed.mp4"
            className={styles.videoElement}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-label="PE AI Camera 360 Spin"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
