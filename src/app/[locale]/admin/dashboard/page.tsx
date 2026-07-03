'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAdminDashboardQuery } from '@/queries/useAdminQueries';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Mail,
  Video,
  TrendingUp,
} from 'lucide-react';
import styles from './style.module.css';

export default function AdminDashboardPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const { data: stats, isLoading, error } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.errorWrapper}>
        <p>{t('errors.generic')}</p>
      </div>
    );
  }

  // Format currency based on locale
  const formatCurrency = (val: number) => {
    if (locale === 'vi') {
      return (val * 25000).toLocaleString('vi-VN') + ' VND';
    }
    return '$' + val.toFixed(2);
  };

  const statCards = [
    {
      title: t('admin.dashboard.revenue'),
      value: formatCurrency(stats.orders.revenue),
      icon: <DollarSign size={24} />,
      color: 'emerald',
    },
    {
      title: t('admin.dashboard.totalOrders'),
      value: stats.orders.total,
      icon: <ShoppingBag size={24} />,
      color: 'blue',
    },
    {
      title: t('admin.dashboard.pendingOrders'),
      value: stats.orders.pending,
      icon: <Clock size={24} />,
      color: 'orange',
    },
    {
      title: t('admin.dashboard.subscribers'),
      value: stats.newsletter.totalSubscribers,
      icon: <Mail size={24} />,
      color: 'purple',
    },
    {
      title: t('admin.dashboard.events'),
      value: stats.tracking.totalEvents,
      icon: <Video size={24} />,
      color: 'pink',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('admin.dashboard.title')}</h1>
          <p className={styles.subtitle}>
            {locale === 'vi' ? 'Chào mừng bạn quay lại hệ thống quản trị.' : 'Welcome back to your administration dashboard.'}
          </p>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <div key={idx} className={`${styles.card} ${styles[card.color]}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{card.title}</span>
              <div className={styles.cardIcon}>{card.icon}</div>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardValue}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome info / charts container placeholder */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoIconWrapper}>
            <TrendingUp size={32} />
          </div>
          <h2 className={styles.infoTitle}>
            {locale === 'vi' ? 'Hiệu suất vận hành camera AI' : 'AI Camera Operations Performance'}
          </h2>
          <p className={styles.infoDesc}>
            {locale === 'vi'
              ? 'Tất cả các sự kiện phát hiện hành vi, bất thường sức khỏe mèo cưng đều được đồng bộ hóa tức thì từ thiết bị camera PE qua Webhook Tracking về cơ sở dữ liệu PostgreSQL.'
              : 'All behavior detection events and abnormal health metrics of cats are instantly synchronized from PE camera devices via Webhook Tracking to the PostgreSQL database.'}
          </p>
        </div>
      </div>
    </div>
  );
}
