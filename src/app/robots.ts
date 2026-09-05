import type { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/dashboard/*',
        '/admin',
        '/admin/*',
        '/api/*',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/auth/*',
        // Per-property guest links are meant only for the guests they're shared
        // with, not for search discovery.
        '/register/*',
        '/guest-identity',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
