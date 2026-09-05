import type { Metadata } from 'next';

const title = 'Contact Us - KoziBnB';
const description = 'Get in touch with our team to learn more about our Airbnb management services.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: { title, description },
  twitter: { title, description },
}; 