'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useThemeStore } from '@/stores/useThemeStore';
import LocaleSwitcher from '@/components/ui/locale-switcher';
import { Sun, Moon, Menu, X, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { Link } from '@/i18n/routing';
import styles from './style.module.css';

export default function NavBar() {
  const t = useTranslations('navbar');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();

  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const setWishlistOpen = useWishlistStore((state) => state.setOpen);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(animFrame);
  }, []);

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
      <Link href="/" className={styles.logoLink} aria-label="PE Home">
        <Image
          src="/logo_noname.png"
          alt="PE Logo"
          width={36}
          height={36}
          priority
          className={styles.logoImg}
        />
        <span className={styles.logo}>PE - For Your Pets</span>
      </Link>

      <div
        className={`${styles.backdrop} ${mobileMenuOpen ? styles.backdropVisible : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

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
          <button
            className={styles.actionIconBtn}
            onClick={() => setWishlistOpen(true)}
            aria-label="Open wishlist"
          >
            <Heart size={16} />
            {mounted && totalWishlistCount > 0 && (
              <span className={styles.badge}>{totalWishlistCount}</span>
            )}
          </button>

          <button
            className={styles.actionIconBtn}
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag size={16} />
            {mounted && totalCartCount > 0 && (
              <span className={styles.badge}>{totalCartCount}</span>
            )}
          </button>

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
