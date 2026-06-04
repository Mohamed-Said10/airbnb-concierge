import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedServices from '@/components/sections/FeaturedServices';

export const metadata: Metadata = {
  title: 'KoziBnB - Professional Airbnb Management in Morocco',
  description: 'KoziBnB handles guest registration, digital fiche de police, and property management for Airbnb hosts in Morocco. Stay compliant and save time.',
  keywords: 'Airbnb management Morocco, fiche de police, guest registration, Marrakech property management, short-term rental',
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
    </>
  );
}
