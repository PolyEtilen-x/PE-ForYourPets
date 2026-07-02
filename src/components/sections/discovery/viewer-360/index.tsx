'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ProductCamera, { ColorKey } from '@/components/ui/product-camera';
import { RotateCw } from 'lucide-react';
import styles from './style.module.css';

interface ProductViewer360Props {
  colorKey: ColorKey;
}

export default function ProductViewer360({ colorKey }: ProductViewer360Props) {
  const t = useTranslations('discovery');
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

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
      <h2 className={styles.title}>{t('viewer.title')}</h2>
      <p className={styles.subtitle}>{t('viewer.sub')}</p>

      {/* Drag Canvas */}
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
          <RotateCw size={13} className={styles.rotateIcon} />
          <span className={styles.degree}>{deg}°</span>
        </div>
        <p className={styles.hint}>{t('viewer.hint')}</p>
      </div>
    </div>
  );
}
