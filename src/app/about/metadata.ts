import type { Metadata } from 'next';

const title = 'About Us - KoziBnB';
const description = 'Learn about our professional Airbnb management team and our mission to help property owners maximize their rental income.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  openGraph: { title, description },
  twitter: { title, description },
}; 