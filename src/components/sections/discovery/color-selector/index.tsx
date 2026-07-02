import React from 'react';
import { useTranslations } from 'next-intl';
import ProductCamera, { ColorKey } from '@/components/ui/product-camera';
import styles from './style.module.css';

interface ColorSelectorProps {
  colorKey: ColorKey;
  setColorKey: (k: ColorKey) => void;
}

export default function ColorSelector({ colorKey, setColorKey }: ColorSelectorProps) {
  const t = useTranslations('discovery');

  const swatches: { key: ColorKey; label: string; hex: string }[] = [
    { key: 'sand', label: t('colors.options.sand'), hex: '#C4A882' },
    { key: 'sage', label: t('colors.options.sage'), hex: '#7A9E7E' },
    { key: 'charcoal', label: t('colors.options.charcoal'), hex: '#5A5A62' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('colors.title')}</h2>
      <p className={styles.subtitle}>{t('colors.sub')}</p>

      {/* Color swatches buttons */}
      <div className={styles.swatches}>
        {swatches.map((s) => (
          <button
            key={s.key}
            onClick={() => setColorKey(s.key)}
            className={styles.button}
            aria-label={`Select color ${s.label}`}
          >
            <div
              className={`${styles.swatch} ${colorKey === s.key ? styles.activeSwatch : ''}`}
              style={{ backgroundColor: s.hex }}
            />
            <span className={`${styles.label} ${colorKey === s.key ? styles.activeLabel : ''}`}>
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Render camera displaying color */}
      <div className={styles.cameraBox}>
        <ProductCamera colorKey={colorKey} />
      </div>
    </div>
  );
}
