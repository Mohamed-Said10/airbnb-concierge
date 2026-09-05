import type { Metadata } from 'next';
import { hreflangAlternates } from '@/lib/seo';
import TermsContent from './TermsContent';

const title = 'Terms of Service - KoziBnB';
const description = 'Terms of Service for KoziBnB property management platform.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/legal/terms', languages: hreflangAlternates('/legal/terms') },
  openGraph: { title, description },
  twitter: { title, description },
};

export default function TermsPage() {
  return <TermsContent />;
}
