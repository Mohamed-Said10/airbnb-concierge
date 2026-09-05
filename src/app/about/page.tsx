import type { Metadata } from 'next';
import AboutContent from '@/components/sections/AboutContent';
import { hreflangAlternates } from '@/lib/seo';

const title = 'About Us - KoziBnB';
const description = 'Learn about our professional Airbnb management team and our mission to help property owners maximize their rental income.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about', languages: hreflangAlternates('/about') },
  openGraph: { title, description },
  twitter: { title, description },
};

const AboutPage = () => {
  return <AboutContent />;
};

export default AboutPage;
