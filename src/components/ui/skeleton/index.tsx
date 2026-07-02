'use client';

import React from 'react';
import styles from './style.module.css';

interface SkeletonProps {
  /** Width (CSS value). Default: '100%' */
  width?: string;
  /** Height (CSS value). Default: '1em' */
  height?: string;
  /** Border radius variant. Default: 'md' */
  radius?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

/**
 * Skeleton — single shimmer block.
 * Use as building block for SkeletonCard, SkeletonText etc.
 */
export function Skeleton({ width = '100%', height = '1em', radius = 'md', className = '' }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[`radius_${radius}`]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonProductCard — matches the real ProductCard layout exactly
 * to prevent CLS during loading.
 */
export function SkeletonProductCard() {
  return (
    <div className={styles.productCard} aria-hidden="true">
      {/* Image placeholder */}
      <div className={styles.imageArea} />

      {/* Text content */}
      <div className={styles.content}>
        {/* Product name — 2 lines */}
        <Skeleton height="16px" width="85%" radius="sm" />
        <Skeleton height="13px" width="60%" radius="sm" className={styles.mt8} />

        {/* Description */}
        <Skeleton height="12px" width="90%" radius="sm" className={styles.mt12} />
        <Skeleton height="12px" width="70%" radius="sm" className={styles.mt6} />

        {/* Price */}
        <div className={styles.priceRow}>
          <Skeleton height="20px" width="72px" radius="sm" />
          <Skeleton height="14px" width="50px" radius="sm" />
        </div>

        {/* Add to cart button */}
        <Skeleton height="40px" width="100%" radius="md" className={styles.mt12} />
      </div>
    </div>
  );
}

/**
 * SkeletonProductGrid — renders N skeleton cards in a grid.
 */
export function SkeletonProductGrid({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}
