'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import styles from './style.module.css';

export default function AdminLoginPage() {
  const t = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'vi';

  const { login, isAuthenticated } = useAdminAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${locale}/admin/dashboard`);
    }
  }, [isAuthenticated, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await apiClient.post('/admin/login', { username, password });
      const { token } = res.data;
      login(token);
      router.push(`/${locale}/admin/dashboard`);
    } catch (err: unknown) {
      console.error(err);
      const apiError = err as { response?: { data?: { message?: string } } };
      setErrorMsg(
        apiError.response?.data?.message ||
        (locale === 'vi'
          ? 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!'
          : 'Login failed. Please check your credentials!')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href={`/${locale}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>{locale === 'vi' ? 'Quay lại' : 'Back'}</span>
          </Link>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.iconWrapper}>
            <Lock size={32} className={styles.lockIcon} />
          </div>

          <h1 className={styles.title}>{t('admin.login.title')}</h1>
          <p className={styles.subtitle}>{t('admin.login.subtitle')}</p>

          {errorMsg && (
            <div className={styles.errorAlert}>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">{t('admin.login.username')}</label>
              <input
                type="text"
                id="username"
                required
                placeholder={locale === 'vi' ? 'Nhập tài khoản...' : 'Enter username...'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">{t('admin.login.password')}</label>
              <input
                type="password"
                id="password"
                required
                placeholder={locale === 'vi' ? 'Nhập mật khẩu...' : 'Enter password...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? t('admin.login.submitting') : t('admin.login.submit')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
