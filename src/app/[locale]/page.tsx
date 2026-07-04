import React from 'react';
import dynamic from 'next/dynamic';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import NavBar from '@/components/sections/navbar';
import HeroSection from '@/components/sections/hero';

// Lazy load mọi section dưới fold — không block LCP Hero
const TensionSection = dynamic(() => import('@/components/sections/tension'), {
  loading: () => <div style={{ minHeight: '600px', background: 'var(--bg-section)' }} />,
});
const CinematicVideoSection = dynamic(() => import('@/components/sections/cinematic-video'), {
  loading: () => <div style={{ minHeight: '400px', background: 'var(--bg-section)' }} />,
});
const RevealSection = dynamic(() => import('@/components/sections/reveal'), {
  loading: () => <div style={{ minHeight: '600px', background: 'var(--bg-section)' }} />,
});
const DiscoverySection = dynamic(() => import('@/components/sections/discovery'), {
  loading: () => <div style={{ minHeight: '600px', background: 'var(--bg-section)' }} />,
});
const ShopSection = dynamic(() => import('@/components/sections/shop'), {
  loading: () => <div style={{ minHeight: '400px', background: 'var(--bg-section)' }} />,
});
const ResolutionSection = dynamic(() => import('@/components/sections/resolution'), {
  loading: () => <div style={{ minHeight: '350px', background: 'var(--bg-section)' }} />,
});
const FooterSection = dynamic(() => import('@/components/sections/footer'), {
  loading: () => <div style={{ minHeight: '200px', background: 'var(--bg-section)' }} />,
});

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomeProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: t('eyebrow'),
  };
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  // Set the locale context for server components
  setRequestLocale(locale);

  return (
    <>
      <NavBar />
      <main style={{ width: '100%' }}>
        <HeroSection />
        <TensionSection />
        <CinematicVideoSection />
        <RevealSection />
        <DiscoverySection />
        <ShopSection />
        <ResolutionSection />
      </main>
      <FooterSection />
    </>
  );
}
