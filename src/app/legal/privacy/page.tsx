import type { Metadata } from 'next';
import { hreflangAlternates } from '@/lib/seo';
import PrivacyContent from './PrivacyContent';

const title = 'Privacy Policy - KoziBnB';
const description = 'Privacy Policy for KoziBnB property management platform.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/legal/privacy', languages: hreflangAlternates('/legal/privacy') },
  openGraph: { title, description },
  twitter: { title, description },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
