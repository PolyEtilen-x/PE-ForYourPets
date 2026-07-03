'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCameraSvg as ProductCamera } from '@/components/ui/product-camera';
import styles from './style.module.css';

export default function SpecGrid() {
  const t = useTranslations('discovery');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [lines, setLines] = useState<{ d: string; active: boolean }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Dictionaries for dynamic mapping of refs preventing layout and index shifting
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const hotspotRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Load 5 spec groups (0: Camera, 1: Connectivity, 2: Dimensions, 3: Battery, 4: Lens)
  const groups = [0, 1, 2, 3, 4].map((idx) => {
    const maxItems = idx === 0 ? 4 : 3;
    const items: string[] = [];
    for (let itemIdx = 0; itemIdx < maxItems; itemIdx++) {
      items.push(t(`specs.groups.${idx}.items.${itemIdx}`));
    }
    return {
      id: idx,
      name: t(`specs.groups.${idx}.name`),
      items,
    };
  });

  const updateLines = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    
    // Check if we are in desktop layout (checking container width or window size)
    const isDesktop = window.innerWidth >= 900;
    if (!isDesktop) {
      setLines([]);
      return;
    }

    const svgRect = svgEl.getBoundingClientRect();

    const newLines = [0, 1, 2, 3, 4].map((idx) => {
      const cardEl = cardRefs.current[idx];
      const hotspotEl = hotspotRefs.current[idx];

      if (!cardEl || !hotspotEl) return { d: '', active: false };

      const cardRect = cardEl.getBoundingClientRect();
      const hotspotRect = hotspotEl.getBoundingClientRect();

      // Card 0, 2, 4 are left-sided; Card 1 & 3 are right-sided
      const isLeft = idx === 0 || idx === 2 || idx === 4;

      // Anchor point on the card relative directly to the SVG canvas coordinates (100% immune to scrolls)
      const x1 = isLeft
        ? cardRect.right - svgRect.left
        : cardRect.left - svgRect.left;
      const y1 = cardRect.top - svgRect.top + 24; // Anchored to card title (static position)

      // Center point of the corresponding hotspot relative directly to the SVG canvas coordinates
      const x2 = hotspotRect.left - svgRect.left + hotspotRect.width / 2;
      const y2 = hotspotRect.top - svgRect.top + hotspotRect.height / 2;

      // Draw a subtle curved bezier path
      const controlX = (x1 + x2) / 2;
      const d = `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;

      return {
        d,
        active: activeCategory === idx,
      };
    });

    setLines(newLines);
  }, [activeCategory]);

  // Update line calculations on window resize and mount
  useEffect(() => {
    let resizeFrameId: number;
    const handleResize = () => {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(updateLines);
    };

    // Run inside animation frame to avoid synchronous setState cascading render warning
    const rId = requestAnimationFrame(updateLines);

    window.addEventListener('resize', handleResize);
    // Slight delay to ensure elements are fully rendered/laid out
    const timer = setTimeout(updateLines, 100);

    return () => {
      cancelAnimationFrame(rId);
      cancelAnimationFrame(resizeFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [updateLines]);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>{t('specs.title')}</h2>

      {/* Desktop Showcase (Radial Layout) */}
      <div className={styles.desktopShowcase}>
        {/* Left column categories (Camera, Lens & Dimensions) */}
        <div className={styles.leftCol}>
          {[groups[0], groups[4], groups[2]].map((group) => {
            const idx = group.id;
            const isActive = activeCategory === idx;
            return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
                onMouseEnter={() => {
                  setActiveCategory(idx);
                  updateLines();
                }}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <h3 className={styles.cardTitle}>{group.name}</h3>
                <div className={`${styles.specsList} ${isActive ? styles.specsListActive : ''}`}>
                  <ul className={styles.list}>
                    {group.items.map((item, j) => (
                      <li key={j} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center column featuring product + hotspots */}
        <div className={styles.centerCol}>
          <div className={styles.cameraWrapper}>
            <ProductCamera colorKey="sage" />

            {/* Glowing active glow ring inside camera */}
            {activeCategory !== null && (
              <div
                className={styles.illuminationGlow}
                style={{
                  top:
                    activeCategory === 0
                      ? '25%'
                      : activeCategory === 1
                      ? '45%'
                      : activeCategory === 2
                      ? '70%'
                      : activeCategory === 3
                      ? '85%'
                      : '50%',
                  left:
                    activeCategory === 0
                      ? '50%'
                      : activeCategory === 1
                      ? '65%'
                      : activeCategory === 2
                      ? '32%'
                      : activeCategory === 3
                      ? '50%'
                      : '50%',
                }}
              />
            )}

            {/* Hotspots */}
            <div
              ref={(el) => { hotspotRefs.current[0] = el; }}
              className={`${styles.hotspot} ${activeCategory === 0 ? styles.activeHotspot : ''}`}
              style={{ top: '25%', left: '50%' }}
              onMouseEnter={() => setActiveCategory(0)}
              onMouseLeave={() => setActiveCategory(null)}
            />
            <div
              ref={(el) => { hotspotRefs.current[1] = el; }}
              className={`${styles.hotspot} ${activeCategory === 1 ? styles.activeHotspot : ''}`}
              style={{ top: '45%', left: '65%' }}
              onMouseEnter={() => setActiveCategory(1)}
              onMouseLeave={() => setActiveCategory(null)}
            />
            <div
              ref={(el) => { hotspotRefs.current[2] = el; }}
              className={`${styles.hotspot} ${activeCategory === 2 ? styles.activeHotspot : ''}`}
              style={{ top: '70%', left: '32%' }}
              onMouseEnter={() => setActiveCategory(2)}
              onMouseLeave={() => setActiveCategory(null)}
            />
            <div
              ref={(el) => { hotspotRefs.current[3] = el; }}
              className={`${styles.hotspot} ${activeCategory === 3 ? styles.activeHotspot : ''}`}
              style={{ top: '85%', left: '50%' }}
              onMouseEnter={() => setActiveCategory(3)}
              onMouseLeave={() => setActiveCategory(null)}
            />
            <div
              ref={(el) => { hotspotRefs.current[4] = el; }}
              className={`${styles.hotspot} ${activeCategory === 4 ? styles.activeHotspot : ''}`}
              style={{ top: '50%', left: '50%' }}
              onMouseEnter={() => setActiveCategory(4)}
              onMouseLeave={() => setActiveCategory(null)}
            />
          </div>
        </div>

        {/* Right column categories (Connectivity & Battery) */}
        <div className={styles.rightCol}>
          {[groups[1], groups[3]].map((group) => {
            const idx = group.id;
            const isActive = activeCategory === idx;
            return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
                onMouseEnter={() => {
                  setActiveCategory(idx);
                  updateLines();
                }}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <h3 className={styles.cardTitle}>{group.name}</h3>
                <div className={`${styles.specsList} ${isActive ? styles.specsListActive : ''}`}>
                  <ul className={styles.list}>
                    {group.items.map((item, j) => (
                      <li key={j} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* SVG Connectors canvas */}
        <svg ref={svgRef} className={styles.svgOverlay}>
          {lines.map((line, i) => (
            <path
              key={i}
              d={line.d}
              className={`${styles.line} ${line.active ? styles.activeLine : ''}`}
            />
          ))}
        </svg>
      </div>

      {/* Mobile & Tablet Showcase (Clean Stack Accordion) */}
      <div className={styles.mobileShowcase}>
        <div className={styles.mobileCameraBox}>
          <ProductCamera colorKey="sage" />
        </div>
        <div className={styles.mobileAccordion}>
          {groups.map((group) => {
            const idx = group.id;
            const isOpen = activeCategory === idx;
            return (
              <div key={idx} className={styles.mobileCard}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => setActiveCategory(isOpen ? null : idx)}
                >
                  <span className={styles.cardTitle}>{group.name}</span>
                  <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    ↓
                  </span>
                </button>
                <div className={`${styles.mobileSpecsList} ${isOpen ? styles.mobileSpecsActive : ''}`}>
                  <ul className={styles.list}>
                    {group.items.map((item, j) => (
                      <li key={j} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
