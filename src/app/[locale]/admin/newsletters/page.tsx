'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  useAdminNewslettersQuery,
  useDeleteSubscriberMutation,
} from '@/queries/useAdminQueries';
import { Trash2 } from 'lucide-react';
import styles from './style.module.css';

export default function AdminNewslettersPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const { data: subs, isLoading, error } = useAdminNewslettersQuery();
  const deleteMutation = useDeleteSubscriberMutation();

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.newsletters.deleteConfirm'))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
        alert(locale === 'vi' ? 'Không thể xóa email này!' : 'Failed to delete subscriber!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>{t('errors.generic')}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('admin.newsletters.title')}</h1>
          <p className={styles.subtitle}>
            {locale === 'vi' ? 'Danh sách khách hàng nhận tin bản tin sản phẩm AI.' : 'Subscribed email list for AI product newsletter.'}
          </p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('admin.newsletters.table.email')}</th>
              <th>{t('admin.newsletters.table.date')}</th>
              <th>{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
              <th>{t('admin.newsletters.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {subs?.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyCell}>
                  {locale === 'vi' ? 'Chưa có email nào đăng ký.' : 'No subscribers found.'}
                </td>
              </tr>
            ) : (
              subs?.map((sub) => (
                <tr key={sub.id} className={!sub.isActive ? styles.inactiveRow : ''}>
                  <td className={styles.emailCol}>{sub.email}</td>
                  <td>
                    {new Date(sub.subscribedAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${sub.isActive ? styles.activeBadge : styles.inactiveBadge}`}>
                      {sub.isActive
                        ? (locale === 'vi' ? 'Đang theo dõi' : 'Active')
                        : (locale === 'vi' ? 'Đã hủy' : 'Unsubscribed')}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className={styles.deleteBtn}
                      title="Unsubscribe"
                      disabled={!sub.isActive}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
