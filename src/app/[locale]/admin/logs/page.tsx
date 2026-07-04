'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAdminLogsQuery } from '@/queries/useAdminQueries';
import { Eye, TerminalSquare, AlertTriangle, Link as LinkIcon, Database } from 'lucide-react';
import styles from './style.module.css';

export default function AdminLogsPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [page, setPage] = useState(1);
  const { data: logs, isLoading, error } = useAdminLogsQuery(page, 50);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'FRONTEND':
        return <TerminalSquare size={14} className={styles.frontendIcon} />;
      case 'WEBHOOK':
        return <LinkIcon size={14} className={styles.webhookIcon} />;
      default:
        return <Database size={14} className={styles.backendIcon} />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'FRONTEND':
        return t('admin.logs.sourceFrontend');
      case 'WEBHOOK':
        return t('admin.logs.sourceWebhook');
      default:
        return t('admin.logs.sourceBackend');
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
          <h1 className={styles.title}>{t('admin.logs.title')}</h1>
          <p className={styles.subtitle}>{t('admin.logs.subtitle')}</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('admin.logs.table.time')}</th>
              <th>{t('admin.logs.table.source')}</th>
              <th>{t('admin.logs.table.path')}</th>
              <th>{t('admin.logs.table.message')}</th>
              <th>{t('admin.logs.table.details')}</th>
            </tr>
          </thead>
          <tbody>
            {!logs || logs.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  {locale === 'vi' ? 'Hệ thống chưa có lỗi nào ghi nhận.' : 'No system logs found.'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className={styles.dateCol}>
                    {new Date(log.createdAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                  </td>
                  <td>
                    <div className={styles.sourceTag}>
                      {getSourceIcon(log.source)}
                      <span>{getSourceLabel(log.source)}</span>
                    </div>
                  </td>
                  <td className={styles.pathCol}>{log.path || '-'}</td>
                  <td className={styles.messageCol}>
                    <AlertTriangle size={14} className={styles.errorIcon} />
                    <span>{log.message}</span>
                  </td>
                  <td className={styles.actionsCol}>
                    <button
                      className={styles.payloadBtn}
                      onClick={() => {
                        alert(JSON.stringify(log.payload || log.stack || 'No payload', null, 2));
                      }}
                      disabled={!log.payload && !log.stack}
                    >
                      <Eye size={14} />
                      <span>{log.payload || log.stack ? t('admin.logs.viewPayload') : t('admin.logs.noPayload')}</span>
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
