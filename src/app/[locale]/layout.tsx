import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Providers from './providers';
import TrackingAlerts from '@/components/ui/tracking-alerts';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/typography.css';
import '@/styles/animations.css';

const fraunces = Fraunces({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL('https://pe-for-your-pets.vercel.app'),
    title: {
      template: '%s | PE-ForYourPets',
      default: 'PE - AI-Powered Cat Health Camera',
    },
    description: 'AI camera giám sát sức khỏe thú cưng 24/7. Biết sớm, yêu thương lâu dài.',
    openGraph: {
      title: 'PE - AI-Powered Cat Health Camera',
      description: 'AI camera giám sát sức khỏe thú cưng 24/7. Biết sớm, yêu thương lâu dài.',
      url: 'https://pe-for-your-pets.vercel.app',
      siteName: 'PE-ForYourPets',
      images: [
        {
          url: '/images/hero-bg.webp',
          width: 1200,
          height: 630,
          alt: 'PE AI Camera for Pets',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PE - AI-Powered Cat Health Camera',
      description: 'AI camera giám sát sức khỏe thú cưng 24/7. Biết sớm, yêu thương lâu dài.',
      images: ['/images/hero-bg.webp'],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: '/vi',
        en: '/en',
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'vi' | 'en')) {
    notFound();
  }

  // Set the locale for server-side usage
  setRequestLocale(locale);

  // Get messages for NextIntlClientProvider
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Inline theme script — runs before paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme-storage');var d=s?JSON.parse(s).state.isDark:true;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {/* Preconnect to Vercel image optimizer for hero LCP */}
        <link rel="preconnect" href="https://pe-for-your-pets.vercel.app" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <TrackingAlerts />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
