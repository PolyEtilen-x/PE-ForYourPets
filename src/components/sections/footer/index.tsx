import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './style.module.css';

export default function FooterSection() {
  const t = useTranslations('footer');

  const linksKeys = ['about', 'privacy', 'contact', 'instagram', 'facebook'] as const;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.logoLink} aria-label="PE Home">
            <Image
              src="/logo_noname.png"
              alt="PE Logo"
              width={32}
              height={32}
              className={styles.logoImg}
            />
            <span className={styles.logo}>PE</span>
          </Link>
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
