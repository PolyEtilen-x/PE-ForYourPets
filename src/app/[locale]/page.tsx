import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import NavBar from '@/components/sections/navbar';
import HeroSection from '@/components/sections/hero';
import TensionSection from '@/components/sections/tension';
import RevealSection from '@/components/sections/reveal';
import DiscoverySection from '@/components/sections/discovery';
import ResolutionSection from '@/components/sections/resolution';
import FooterSection from '@/components/sections/footer';
import ChatbotBubble from '@/components/sections/chatbot';

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
        <RevealSection />
        <DiscoverySection />
        <ResolutionSection />
      </main>
      <FooterSection />
      <ChatbotBubble />
    </>
  );
}
