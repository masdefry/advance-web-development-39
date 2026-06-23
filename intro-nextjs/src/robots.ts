import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://purwadhika.com/';

  return {
    rules: [
      {
        userAgent: '*',

        // Public pages that can be indexed (landing pages / menus for marketing and QR ordering)
        allow: ['/', '/menu', '/about', '/contact'],
        // Operational pages for the kiosk — should not be indexed by search engines
        disallow: ['/kiosk', '/order', '/checkout', '/cart', '/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
