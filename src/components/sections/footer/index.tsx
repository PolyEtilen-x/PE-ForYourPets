import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './style.module.css';

export default function FooterSection() {
  const t = useTranslations('footer');

  const linksKeys = ['about', 'privacy', 'contact', 'instagram', 'facebook'] as const;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <span className={styles.logo}>PE</span>
          <div className={styles.links}>
            {linksKeys.map((key) => (
              <a key={key} href="#" className={styles.link}>
                {t(`links.${key}`)}
              </a>
            ))}
          </div>
        </div>
        <p className={styles.copyright}>{t('copyright')}</p>
      </div>
    </footer>
  );
}
