'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import SpecGrid from './spec-grid';
import styles from './style.module.css';

// Lazy-load Recharts graphs and interactive viewer to keep bundle sizes optimized
const FeatureTabs = dynamic(() => import('./feature-tabs'), {
  ssr: false,
  loading: () => <div className={styles.loadingPlaceholder}>Loading details...</div>,
});

const ProductViewer360 = dynamic(() => import('./viewer-360'), {
  ssr: false,
  loading: () => <div className={styles.loadingPlaceholder}>Loading viewer...</div>,
});

export default function DiscoverySection() {
  return (
    <section id="specs" className={styles.section}>
      <div className={styles.container}>
        {/* Sub-section 1: Feature Tabs charts */}
        <FeatureTabs />

        {/* Sub-section 2: Technical specifications details */}
        <SpecGrid />

        {/* Sub-section 3 & 4: Integrated Color Swatches & 360 Viewer */}
        <ProductViewer360 />
      </div>
    </section>
  );
}
