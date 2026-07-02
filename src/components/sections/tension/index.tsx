import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './style.module.css';

const TENSION_PHOTOS = [
  'https://images.unsplash.com/photo-1768075355505-218cbb2e6a57?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1759687134869-d6d858a866ea?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1768670449312-dbc58f191cd1?w=800&h=700&fit=crop&auto=format&q=80',
];

export default function TensionSection() {
  const t = useTranslations('tension');

  // We have 3 cards configured in JSON messages
  const cards = [0, 1, 2].map((idx) => ({
    photo: TENSION_PHOTOS[idx],
    alt: t(`cards.${idx}.alt`),
    statement: t(`cards.${idx}.statement`),
    accent: t(`cards.${idx}.accent`),
    sub: t(`cards.${idx}.sub`),
    // Use mint color for card 0 and 2, orange for card 1
    accentClass: idx === 1 ? styles.accentOrange : styles.accentMint,
  }));

  return (
    <section id="features" className={styles.section}>
      <p className={styles.label}>{t('sectionLabel')}</p>

      <div className={styles.scrollContainer}>
        {cards.map((card, i) => (
          <div key={i} className={styles.card}>
            {/* Image header */}
            <div className={styles.imageWrapper}>
              <Image
                src={card.photo}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 82vw, 480px"
                className={styles.image}
              />
              <div className={styles.imageOverlay} />
              <span className={styles.number}>
                {String(i + 1).padStart(2, '0')} / 03
              </span>
            </div>

            {/* Text details */}
            <div className={styles.details}>
              <p className={styles.statement}>
                {card.statement.split(card.accent).map((part, j, arr) => (
                  <span key={j}>
                    {part}
                    {j < arr.length - 1 && (
                      <span className={`${styles.accentWord} ${card.accentClass}`}>
                        {card.accent}
                      </span>
                    )}
                  </span>
                ))}
              </p>
              <p className={styles.subText}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
