import type { Metadata } from 'next';
import ServicesContent from '@/components/sections/ServicesContent';
import { hreflangAlternates } from '@/lib/seo';

const title = 'Our Services - KoziBnB';
const description = 'Comprehensive Airbnb management services including property management, guest communication, cleaning services, and revenue optimization.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services', languages: hreflangAlternates('/services') },
  openGraph: { title, description },
  twitter: { title, description },
};

const ServicesPage = () => {
  return <ServicesContent />;
};

export default ServicesPage;
