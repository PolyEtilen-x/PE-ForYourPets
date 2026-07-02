'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import styles from './style.module.css';

const MINT = '#8FE3C0';
const ORANGE = '#F2A65A';

const activityData = [
  { h: '00', v: 0.2 },
  { h: '03', v: 0.1 },
  { h: '06', v: 0.8 },
  { h: '09', v: 1.8 },
  { h: '12', v: 1.2 },
  { h: '15', v: 2.1 },
  { h: '18', v: 2.6 },
  { h: '21', v: 1.4 },
  { h: '23', v: 0.6 },
];

const behaviorData = [
  { d: 'T2', eat: 3, sleep: 14 },
  { d: 'T3', eat: 2.5, sleep: 15 },
  { d: 'T4', eat: 3.2, sleep: 13 },
  { d: 'T5', eat: 2, sleep: 16 },
  { d: 'T6', eat: 3.5, sleep: 13 },
  { d: 'T7', eat: 4, sleep: 12 },
  { d: 'CN', eat: 3.8, sleep: 13 },
];

const healthData = [
  { w: 'T1', score: 78 },
  { w: 'T2', score: 81 },
  { w: 'T3', score: 79 },
  { w: 'T4', score: 83 },
  { w: 'T5', score: 85 },
  { w: 'T6', score: 82 },
  { w: 'T7', score: 87 },
  { w: 'T8', score: 91 },
];

interface ChartTipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit: string;
}

function ChartTip({ active, payload, label, unit }: ChartTipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipVal}>
        {payload[0]?.value}
        {unit}
      </p>
    </div>
  );
}

export default function FeatureTabs() {
  const t = useTranslations('discovery');
  const [tab, setTab] = useState<'activity' | 'behavior' | 'report'>('activity');

  const axisStyle = {
    fontSize: 11,
    fontFamily: 'var(--font-jetbrains), monospace',
    fill: 'var(--text-muted)',
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>
        {t('heading')}
        <em className={styles.accent}>{t('headingAccent')}</em>
      </h2>

      {/* Tabs selector */}
      <div className={styles.tabsList}>
        {(['activity', 'behavior', 'report'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`${styles.tabBtn} ${tab === key ? styles.activeTab : ''}`}
          >
            {t(`tabs.${key}.label`)}
          </button>
        ))}
      </div>

      {/* Dynamic chart canvas */}
      <div className={styles.chartBox}>
        {tab === 'activity' && (
          <>
            <div className={styles.chartHeader}>
              <div>
                <p className={styles.chartTitle}>{t('tabs.activity.title')}</p>
                <p className={styles.metricVal}>
                  72 <span className={styles.metricUnit}>{t('tabs.activity.unit')}</span>
                </p>
              </div>
              <div className={styles.chartExtra}>
                <p className={styles.extraLabel}>{t('tabs.activity.extraLabel')}</p>
                <p className={styles.extraVal}>{t('tabs.activity.extraValue')}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={activityData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={MINT} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={MINT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="h" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip content={<ChartTip unit="" />} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={MINT}
                  strokeWidth={2}
                  fill="url(#activityGlow)"
                  dot={{ fill: MINT, r: 3, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === 'behavior' && (
          <>
            <div className={styles.chartHeader}>
              <div>
                <p className={styles.chartTitle}>{t('tabs.behavior.title')}</p>
                <p className={styles.metricVal} style={{ color: ORANGE }}>
                  3.2 <span className={styles.metricUnit}>{t('tabs.behavior.unit')}</span>
                </p>
              </div>
              <div className={styles.chartExtra}>
                <p className={styles.extraLabel}>{t('tabs.behavior.extraLabel')}</p>
                <p className={styles.extraVal} style={{ color: MINT }}>
                  {t('tabs.behavior.extraValue')}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={behaviorData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="d" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip content={<ChartTip unit={t('tabs.behavior.unit')} />} />
                <Bar dataKey="eat" fill={ORANGE} radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === 'report' && (
          <>
            <div className={styles.chartHeader}>
              <div>
                <p className={styles.chartTitle}>{t('tabs.report.title')}</p>
                <p className={styles.metricVal}>
                  91 <span className={styles.metricUnit}>{t('tabs.report.unit')}</span>
                </p>
              </div>
              <div className={styles.chartExtra}>
                <p className={styles.extraLabel}>{t('tabs.report.extraLabel')}</p>
                <p className={styles.extraVal} style={{ color: MINT }}>
                  {t('tabs.report.extraValue')}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={healthData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="w" tick={axisStyle} />
                <YAxis domain={[70, 100]} tick={axisStyle} />
                <Tooltip content={<ChartTip unit="" />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={MINT}
                  strokeWidth={2}
                  dot={{ fill: MINT, r: 3, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
