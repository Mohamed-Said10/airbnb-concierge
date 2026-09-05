import type { Metadata } from 'next';

const title = 'Our Services - KoziBnB';
const description = 'Comprehensive Airbnb management services including property management, guest communication, cleaning services, and revenue optimization.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services' },
  openGraph: { title, description },
  twitter: { title, description },
}; 