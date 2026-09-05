import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedServices from '@/components/sections/FeaturedServices';

const title = 'KoziBnB - Professional Airbnb Management in Morocco';
const description = 'KoziBnB handles guest registration, digital fiche de police, and property management for Airbnb hosts in Morocco. Stay compliant and save time.';

export const metadata: Metadata = {
  title,
  description,
  keywords: 'Airbnb management Morocco, fiche de police, guest registration, Marrakech property management, short-term rental',
  alternates: { canonical: '/' },
  openGraph: { title, description },
  twitter: { title, description },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
    </>
  );
}
