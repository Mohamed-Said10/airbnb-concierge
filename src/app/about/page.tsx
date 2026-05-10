import type { Metadata } from 'next';
import AboutContent from '@/components/sections/AboutContent';

export const metadata: Metadata = {
  title: 'About Us - KoziBnB',
  description: 'Learn about our professional Airbnb management team and our mission to help property owners maximize their rental income.',
};

const AboutPage = () => {
  return <AboutContent />;
};

export default AboutPage;
