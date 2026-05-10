import type { Metadata } from 'next';
import ServicesContent from '@/components/sections/ServicesContent';

export const metadata: Metadata = {
  title: 'Our Services - KoziBnB',
  description: 'Comprehensive Airbnb management services including property management, guest communication, cleaning services, and revenue optimization.',
};

const ServicesPage = () => {
  return <ServicesContent />;
};

export default ServicesPage;
