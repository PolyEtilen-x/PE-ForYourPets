'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ui/scroll-reveal';
import SpecGrid from './spec-grid';
import styles from './style.module.css';

import LazyRender from '@/components/ui/lazy-render';

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
        <ScrollReveal animation="revealUp" duration={700}>
          <LazyRender minHeight={240} fallback={<div className={styles.loadingPlaceholder}>Loading details...</div>}>
            <FeatureTabs />
          </LazyRender>
        </ScrollReveal>

        {/* Sub-section 2: Technical specifications — stagger each spec card via CSS */}
        <ScrollReveal animation="revealUp" delay={100} duration={700}>
          <SpecGrid />
        </ScrollReveal>

        {/* Sub-section 3 & 4: Integrated Color Swatches & 360 Viewer */}
        <ScrollReveal animation="scaleIn" delay={150} duration={800}>
          <LazyRender minHeight={360} fallback={<div className={styles.loadingPlaceholder}>Loading viewer...</div>}>
            <ProductViewer360 />
          </LazyRender>
        </ScrollReveal>
      </div>
    </section>
  );
}
