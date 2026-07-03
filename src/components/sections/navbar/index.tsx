'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useThemeStore } from '@/stores/useThemeStore';
import LocaleSwitcher from '@/components/ui/locale-switcher';
import { Sun, Moon, Menu, X } from 'lucide-react';
import styles from './style.module.css';

export default function NavBar() {
  const t = useTranslations('navbar');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 56);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync isDark with document element class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const unscrolledDark = !scrolled && !isDark ? styles.unscrolledDark : '';

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${unscrolledDark}`}>
      <span className={styles.logo}>PE - For Your Pets</span>

      <div className={`${styles.menu} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.links}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>
            {t('links.features')}
          </a>
          <a href="#specs" onClick={() => setMobileMenuOpen(false)}>
            {t('links.specs')}
          </a>
          <a href="#order" onClick={() => setMobileMenuOpen(false)}>
            {t('links.order')}
          </a>
        </div>

        <div className={styles.actions}>
          <LocaleSwitcher />

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            <span>{isDark ? t('theme.light') : t('theme.dark')}</span>
          </button>
        </div>
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </nav>
  );
}
