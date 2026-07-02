'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './style.module.css';

const TENSION_PHOTOS = [
  'https://images.unsplash.com/photo-1768075355505-218cbb2e6a57?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1759687134869-d6d858a866ea?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1768670449312-dbc58f191cd1?w=800&h=700&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=700&fit=crop&auto=format&q=80',
];

export default function TensionSection() {
  const t = useTranslations('tension');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    
    // Disable snapping and transition animation while dragging for absolute smoothness
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.scrollBehavior = 'auto';
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUpOrLeave = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    
    // Restore snap behaviour to automatically slide cleanly into place
    scrollRef.current.style.scrollSnapType = 'x mandatory';
    scrollRef.current.style.scrollBehavior = 'smooth';
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.removeProperty('user-select');
  };

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

  return (
    <section id="features" className={styles.section}>
      <p className={styles.label}>{t('sectionLabel')}</p>

      <div
        ref={scrollRef}
        className={styles.scrollContainer}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        style={{ cursor: 'grab' }}
      >
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
                {String(i + 1).padStart(2, '0')} / 04
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
