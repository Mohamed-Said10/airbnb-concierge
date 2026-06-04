import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - KoziBnB',
  description: 'Privacy Policy for KoziBnB property management platform.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <Link href="/" className="text-primary-600 hover:underline text-sm">← Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: June 2026</p>
      </div>

      <Section title="1. Who We Are">
        <p>KoziBnB is a property management platform that helps short-term rental hosts in Morocco collect digital guest registrations and comply with local tourism regulations. Our registered address and contact information are available on our <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.</p>
      </Section>

      <Section title="2. Data We Collect">
        <p><strong>Host account data:</strong> When you create an account, we collect your name, email address, and password (hashed).</p>
        <p><strong>Property data:</strong> Property names, addresses, and guest registration link slugs you create.</p>
        <p><strong>Guest registration data:</strong> Personal information submitted by your guests, including full name, date of birth, place of birth, nationality, identity document type and number, expiry date, home address, and photos of identity documents. This data is collected on behalf of the host for regulatory compliance purposes.</p>
        <p><strong>Usage data:</strong> Standard server logs including IP addresses, browser type, and pages accessed.</p>
      </Section>

      <Section title="3. How We Use Your Data">
        <p>We use collected data to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide and operate the KoziBnB platform.</li>
          <li>Store guest registration records on behalf of hosts for compliance with Moroccan tourism regulations (Dahir n° 1-02-176).</li>
          <li>Send transactional emails such as new registration notifications.</li>
          <li>Improve platform security and performance.</li>
        </ul>
        <p>We do not sell, rent, or share your data or your guests' data with third parties for marketing purposes.</p>
      </Section>

      <Section title="4. Data Retention">
        <p>Guest registration data is retained for as long as required by applicable tourism regulations. Hosts may request deletion of their account and associated data by contacting us. Guest data submitted for regulatory compliance may be retained as required by law.</p>
      </Section>

      <Section title="5. Data Security">
        <p>We store data on Supabase, a secure cloud database provider with encryption at rest and in transit. Identity document photos are stored in private, access-controlled storage. We implement role-based access controls to ensure only authorized hosts can view their own guests' data.</p>
      </Section>

      <Section title="6. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data (subject to legal retention requirements).</li>
          <li>Object to or restrict processing of your data.</li>
        </ul>
        <p>To exercise these rights, contact us through our <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.</p>
      </Section>

      <Section title="7. Cookies">
        <p>We use essential session cookies to keep you logged in. We do not use tracking or advertising cookies.</p>
      </Section>

      <Section title="8. Third-Party Services">
        <p>We use the following third-party services to operate the platform:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
          <li><strong>Brevo</strong> — transactional email delivery.</li>
        </ul>
        <p>Each of these providers has their own privacy policy and data processing agreements in place.</p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notice.</p>
      </Section>

      <Section title="10. Contact">
        <p>For privacy-related questions or requests, contact us at our <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.</p>
      </Section>
    </div>
  );
}
