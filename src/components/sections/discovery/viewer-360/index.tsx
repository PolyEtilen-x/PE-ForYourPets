'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ProductCamera, { ColorKey } from '@/components/ui/product-camera';
import { useProductQuery } from '@/queries/useProductQuery';
import { useCartStore } from '@/stores/useCartStore';
import { RotateCw, ShoppingCart } from 'lucide-react';
import styles from './style.module.css';

export default function ProductViewer360() {
  const t = useTranslations('discovery');
  const [colorKey, setColorKey] = useState<ColorKey>('sage');
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const { data: cameraProduct } = useProductQuery('pe');
  const { addItem } = useCartStore();

  const swatches: { key: ColorKey; label: string; hex: string }[] = [
    { key: 'sand', label: t('colors.options.sand'), hex: '#C4A882' },
    { key: 'sage', label: t('colors.options.sage'), hex: '#7A9E7E' },
    { key: 'charcoal', label: t('colors.options.charcoal'), hex: '#5A5A62' },
  ];

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    lastX.current = e.touches[0].clientX;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    setRotation((r) => (r + (e.clientX - lastX.current) * 0.65) % 360);
    lastX.current = e.clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current) return;
    setRotation((r) => (r + (e.touches[0].clientX - lastX.current) * 0.65) % 360);
    lastX.current = e.touches[0].clientX;
  }, []);

  const onEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  const deg = Math.round(((rotation % 360) + 360) % 360);

  return (
    <div className={styles.container}>
      {/* Left Column: Title, Subtitle, and Color selection */}
      <div className={styles.infoCol}>
        <h2 className={styles.title}>{t('viewer.title')}</h2>
        <p className={styles.subtitle}>{t('colors.sub')}</p>

        <div className={styles.swatches}>
          {swatches.map((s) => (
            <button
              key={s.key}
              onClick={() => setColorKey(s.key)}
              className={styles.swatchButton}
              aria-label={`Select color ${s.label}`}
            >
              <div
                className={`${styles.swatch} ${colorKey === s.key ? styles.activeSwatch : ''}`}
                style={{ backgroundColor: s.hex }}
              />
              <span className={`${styles.swatchLabel} ${colorKey === s.key ? styles.activeLabel : ''}`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Rotatable 360-degree Viewer card */}
      <div className={styles.viewerCol}>
        <div
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onEnd}
          className={styles.viewerBox}
        >
          <div className={styles.cameraBox}>
            <ProductCamera colorKey={colorKey} rotation={rotation} />
          </div>
          <div className={styles.metrics}>
            <RotateCw size={14} className={styles.rotateIcon} />
            <span className={styles.degree}>{deg}°</span>
          </div>
          <p className={styles.hint}>{t('viewer.hint')}</p>
        </div>

        {cameraProduct && (
          <div className={styles.buyWrapper}>
            <div className={styles.priceRow}>
              <span className={styles.price}>${cameraProduct.price.toFixed(2)}</span>
              {cameraProduct.compareAtPrice && (
                <span className={styles.comparePrice}>${cameraProduct.compareAtPrice.toFixed(2)}</span>
              )}
            </div>
            <button className={styles.addToCartBtn} onClick={() => addItem(cameraProduct)}>
              <ShoppingCart size={16} />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
