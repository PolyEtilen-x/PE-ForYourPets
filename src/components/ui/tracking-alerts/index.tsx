'use client';

import React, { useEffect } from 'react';
import { useTrackingStore, TrackingAlert } from '@/stores/useTrackingStore';
import { Activity, X } from 'lucide-react';
import styles from './style.module.css';

export default function TrackingAlerts() {
  const { alerts, removeAlert } = useTrackingStore();

  return (
    <div className={styles.container}>
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onDismiss={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
}

function AlertCard({ alert, onDismiss }: { alert: TrackingAlert; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, alert.type === 'error' ? 5000 : 3500);
    return () => clearTimeout(timer);
  }, [onDismiss, alert.type]);

  const errorClass = alert.type === 'error' ? styles.cardError : '';

  return (
    <div className={`${styles.card} ${errorClass}`.trim()}>
      <div className={styles.pulseWrapper}>
        <Activity size={14} className={styles.icon} />
        <span className={styles.pulseDot} />
      </div>
      <div className={styles.content}>
        <span className={styles.eventLabel}>{alert.eventType}</span>
        <p className={styles.message}>{alert.message}</p>
      </div>
      <button onClick={onDismiss} className={styles.closeBtn} aria-label="Dismiss alert">
        <X size={14} />
      </button>
    </div>
  );
}
