'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

export default function CinematicVideoSection() {
  return (
    <section className={styles.section}>
      <ScrollReveal animation="revealUp" duration={1000}>
        <div className={styles.videoWrapper}>
          <img
            src="/videos/Video-Project.gif"
            alt="PE AI Camera 360 Spin"
            className={styles.videoElement}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
