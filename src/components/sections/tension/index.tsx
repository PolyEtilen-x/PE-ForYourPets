'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

const TENSION_PHOTOS = [
  'https://images.unsplash.com/photo-1768075355505-218cbb2e6a57?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1759687134869-d6d858a866ea?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1768670449312-dbc58f191cd1?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=700&fit=crop&auto=format&q=80',
];

export default function TensionSection() {
  const t = useTranslations('tension');

  // We have 4 cards configured in JSON messages
  const cards = [0, 1, 2, 3].map((idx) => ({
    photo: TENSION_PHOTOS[idx],
    alt: t(`cards.${idx}.alt`),
    statement: t(`cards.${idx}.statement`),
    accent: t(`cards.${idx}.accent`),
    sub: t(`cards.${idx}.sub`),
    // Use mint color for card 0, 2; orange for card 1, 3
    accentClass: idx % 2 === 1 ? styles.accentOrange : styles.accentMint,
  }));

  // Double the cards to create a seamless infinite loop marquee
  const marqueeCards = [...cards, ...cards];

  return (
    <section id="features" className={styles.section}>
      <ScrollReveal animation="slideInLeft" duration={600}>
        <p className={styles.label}>{t('sectionLabel')}</p>
      </ScrollReveal>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeCards.map((card, i) => (
            <div key={i} className={styles.card}>
              {/* Image header */}
              <div className={styles.imageWrapper}>
                <Image
                  src={card.photo}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={styles.image}
                  priority={i < 2}
                />
                <div className={styles.imageOverlay} />
                <span className={styles.number}>/ 0{(i % 4) + 1}</span>
              </div>

              {/* Text details */}
              <div className={styles.details}>
                <h3 className={styles.statement}>
                  {card.statement.split(card.accent)[0]}
                  <span className={`${styles.accentWord} ${card.accentClass}`}>
                    {card.accent}
                  </span>
                  {card.statement.split(card.accent)[1]}
                </h3>
                <p className={styles.subText}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
