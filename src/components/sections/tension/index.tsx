'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

const TENSION_PHOTOS = [
  '/img_tension/1.avif',
  '/img_tension/2.avif',
  '/img_tension/3.avif',
  '/img_tension/4.avif',
  '/img_tension/5.jpg',
  '/img_tension/6.jpg',
  '/img_tension/7.jpg',
  '/img_tension/8.jpg',
];

export default function TensionSection() {
  const t = useTranslations('tension');

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const xOffset = useRef(0);

  // Map 10 text items from translation file, cycling through the 8 photos
  const cards = Array.from({ length: 10 }).map((_, idx) => ({
    photo: TENSION_PHOTOS[idx % 8],
    alt: t(`cards.${idx}.alt`),
    statement: t(`cards.${idx}.statement`),
    accent: t(`cards.${idx}.accent`),
    sub: t(`cards.${idx}.sub`),
    accentClass: idx % 2 === 1 ? styles.accentOrange : styles.accentMint,
  }));
  const marqueeCards = [...cards, ...cards];

  // 1. Marquee Animation Loop & Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let rafId: number;
    let lastTime = performance.now();
    let isVisible = false;

    // Slower on mobile, slightly faster on desktop
    const getSpeed = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return 30; // Mobile: 30px/sec
      }
      return 60; // Desktop: 60px/sec
    };

    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Limit delta to prevent huge jumps on tab switch
      const clampedDelta = Math.min(delta, 0.1);

      if (isVisible && !isDragging.current) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          xOffset.current -= getSpeed() * clampedDelta;
          if (xOffset.current <= -halfWidth) {
            xOffset.current += halfWidth;
          }
          track.style.transform = `translate3d(${xOffset.current}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now(); // reset timer to prevent jump
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    rafId = requestAnimationFrame(update);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. Interactive Manual Drag/Swipe support
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const onPointerDown = (e: PointerEvent) => {
      // Only drag with left click or touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDragging.current = true;
      lastX.current = e.clientX;
      container.setPointerCapture(e.pointerId);
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        xOffset.current += dx;
        // Keep it looping infinitely during manual drag
        if (xOffset.current <= -halfWidth) {
          xOffset.current += halfWidth;
        } else if (xOffset.current > 0) {
          xOffset.current -= halfWidth;
        }
        track.style.transform = `translate3d(${xOffset.current}px, 0, 0)`;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      container.style.cursor = '';
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <section id="features" className={styles.section}>
      <ScrollReveal animation="slideInLeft" duration={600}>
        <p className={styles.label}>{t('sectionLabel')}</p>
      </ScrollReveal>

      <div ref={containerRef} className={styles.marqueeContainer}>
        <div ref={trackRef} className={styles.marqueeTrack}>
          {marqueeCards.map((card, i) => (
            <div key={i} className={styles.card}>
              {/* Image header */}
              <div className={styles.imageWrapper}>
                <Image
                  src={card.photo}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 82vw, 480px"
                  unoptimized={true}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
                <span className={styles.number}>/ {(i % 10) + 1 < 10 ? '0' : ''}{(i % 10) + 1}</span>
              </div>

              {/* Text details */}
              <div className={styles.details}>
                <p className={styles.statement}>
                  {card.statement.split(card.accent)[0]}
                  <span className={`${styles.accentWord} ${card.accentClass}`}>
                    {card.accent}
                  </span>
                  {card.statement.split(card.accent)[1]}
                </p>
                <p className={styles.subText}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
