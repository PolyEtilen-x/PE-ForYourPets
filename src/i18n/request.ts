import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'vi' | 'en')) {
    locale = routing.defaultLocale;
  }

  // Load message files dynamically for the requested locale
  const [common, navbar, hero, tension, reveal, discovery, resolution, footer] =
    await Promise.all([
      import(`../messages/${locale}/common.json`).then((m) => m.default),
      import(`../messages/${locale}/navbar.json`).then((m) => m.default),
      import(`../messages/${locale}/hero.json`).then((m) => m.default),
      import(`../messages/${locale}/tension.json`).then((m) => m.default),
      import(`../messages/${locale}/reveal.json`).then((m) => m.default),
      import(`../messages/${locale}/discovery.json`).then((m) => m.default),
      import(`../messages/${locale}/resolution.json`).then((m) => m.default),
      import(`../messages/${locale}/footer.json`).then((m) => m.default),
    ]);

  return {
    locale,
    messages: {
      common,
      navbar,
      hero,
      tension,
      reveal,
      discovery,
      resolution,
      footer,
    },
  };
});
