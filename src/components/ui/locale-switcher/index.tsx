'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import styles from './style.module.css';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (nextLocale: 'vi' | 'en') => {
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className={styles.switcher}>
      <button
        onClick={() => changeLocale('vi')}
        className={`${styles.btn} ${locale === 'vi' ? styles.active : ''}`}
        aria-label="Tiếng Việt"
      >
        VI
      </button>
      <span className={styles.separator}>|</span>
      <button
        onClick={() => changeLocale('en')}
        className={`${styles.btn} ${locale === 'en' ? styles.active : ''}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
