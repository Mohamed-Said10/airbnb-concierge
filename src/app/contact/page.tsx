import type { Metadata } from 'next';
import ContactContent from './ContactContent';
import { hreflangAlternates } from '@/lib/seo';

const title = 'Contact Us - KoziBnB';
const description = 'Get in touch with KoziBnB to learn how we can manage your Airbnb property in Morocco. We handle guest registration, compliance, and more.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact', languages: hreflangAlternates('/contact') },
  openGraph: { title, description },
  twitter: { title, description },
};

export default function ContactPage() {
  return <ContactContent />;
}
