import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us - KoziBnB',
  description: 'Get in touch with KoziBnB to learn how we can manage your Airbnb property in Morocco. We handle guest registration, compliance, and more.',
};

export default function ContactPage() {
  return <ContactContent />;
}
