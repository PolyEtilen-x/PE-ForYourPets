'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Mail,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import styles from './style.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params?.locale as string) || 'vi';

  const { isAuthenticated, logout } = useAdminAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === `/${locale}/admin/login`;

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  // Guard: if not authenticated and not on login page, redirect to login
  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      router.push(`/${locale}/admin/login`);
    }
  }, [mounted, isAuthenticated, isLoginPage, locale, router]);

  // Close sidebar on path changes (mobile)
  useEffect(() => {
    const handle = requestAnimationFrame(() => setSidebarOpen(false));
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  // If on login page, render children directly without admin shell wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, render children (which handles redirect)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin/login`);
  };

  const navItems = [
    {
      name: t('admin.sidebar.dashboard'),
      path: `/${locale}/admin/dashboard`,
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: t('admin.sidebar.products'),
      path: `/${locale}/admin/products`,
      icon: <ShoppingBag size={18} />,
    },
    {
      name: t('admin.sidebar.orders'),
      path: `/${locale}/admin/orders`,
      icon: <ClipboardList size={18} />,
    },
    {
      name: t('admin.sidebar.newsletters'),
      path: `/${locale}/admin/newsletters`,
      icon: <Mail size={18} />,
    },
  ];

  return (
    <div className={styles.layoutWrapper}>
      {/* Mobile Header Bar */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.hamburgerBtn}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className={styles.mobileTitle}>PE Admin</span>
        <div className={styles.spacer} />
      </header>

      {/* Sidebar navigation */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href={`/${locale}`} className={styles.logoLink}>
            <Image
              src="/logo_noname.png"
              alt="PE Logo"
              width={32}
              height={32}
              className={styles.logoImg}
            />
            <span className={styles.logoText}>PE Admin</span>
          </Link>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              <User size={16} />
            </div>
            <div className={styles.userMeta}>
              <span className={styles.username}>Administrator</span>
              <span className={styles.role}>Owner</span>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>{t('admin.sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content body */}
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>{children}</div>
      </main>

      {/* Backdrop overlay for mobile menu */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
