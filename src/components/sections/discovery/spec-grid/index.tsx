import React from 'react';
import { useTranslations } from 'next-intl';
import ProductCamera from '@/components/ui/product-camera';
import styles from './style.module.css';

export default function SpecGrid() {
  const t = useTranslations('discovery');

  // Load 4 spec groups configured in our messages JSON
  const groups = [0, 1, 2, 3].map((idx) => {
    // Specs items count: camera has 4, others have 3
    const maxItems = idx === 0 ? 4 : 3;
    const items: string[] = [];

    for (let itemIdx = 0; itemIdx < maxItems; itemIdx++) {
      items.push(t(`specs.groups.${idx}.items.${itemIdx}`));
    }

    return {
      name: t(`specs.groups.${idx}.name`),
      items,
    };
  });

  return (
    <div className={styles.grid}>
      {/* Sticky Camera visual on left */}
      <div className={styles.stickyCol}>
        <div className={styles.cameraBox}>
          <ProductCamera colorKey="sage" />
        </div>
      </div>

      {/* Spec details lists on right */}
      <div className={styles.specsCol}>
        <h2 className={styles.title}>{t('specs.title')}</h2>
        {groups.map((group, i) => (
          <div key={i} className={styles.group}>
            <p className={styles.groupName}>{group.name}</p>
            <ul className={styles.list}>
              {group.items.map((item, j) => (
                <li key={j} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
