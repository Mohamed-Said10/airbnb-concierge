import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - KoziBnB',
  description: 'Terms of Service for KoziBnB property management platform.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <Link href="/" className="text-primary-600 hover:underline text-sm">← Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: June 2026</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>By accessing or using KoziBnB ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>KoziBnB is a property management platform that enables short-term rental hosts to collect digital guest registrations, manage guest identity documents, and comply with local tourism regulations, including the <em>fiche de police</em> obligation in Morocco.</p>
      </Section>

      <Section title="3. Account Registration">
        <p>You must create an account to use the host dashboard. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate and complete information when registering.</p>
      </Section>

      <Section title="4. Host Responsibilities">
        <p>As a host using KoziBnB, you are responsible for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensuring your use of collected guest data complies with applicable local laws and tourism regulations.</li>
          <li>Keeping guest identity data confidential and secure.</li>
          <li>Notifying guests that their information will be collected and stored for regulatory compliance purposes.</li>
          <li>Complying with all applicable data protection laws, including GDPR where applicable.</li>
        </ul>
      </Section>

      <Section title="5. Guest Data and Privacy">
        <p>KoziBnB stores guest registration data on your behalf. This data includes personal information such as full name, date of birth, nationality, and identity document details. You may not use this data for any purpose other than regulatory compliance and property management.</p>
        <p>We implement industry-standard security measures to protect stored data. However, you acknowledge that no method of transmission over the Internet is 100% secure.</p>
      </Section>

      <Section title="6. Prohibited Uses">
        <p>You agree not to use the Service to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Collect guest data for purposes other than legal compliance and property management.</li>
          <li>Sell, share, or disclose guest personal information to third parties.</li>
          <li>Violate any applicable law or regulation.</li>
          <li>Attempt to gain unauthorized access to the Service or its systems.</li>
        </ul>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>KoziBnB is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to regulatory fines resulting from non-compliance.</p>
      </Section>

      <Section title="8. Termination">
        <p>We reserve the right to suspend or terminate your account at our discretion if you violate these Terms of Service. You may delete your account at any time by contacting us.</p>
      </Section>

      <Section title="9. Changes to Terms">
        <p>We may update these Terms of Service from time to time. We will notify you of material changes by email or through the platform. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
      </Section>

      <Section title="10. Contact">
        <p>For questions about these Terms of Service, please contact us at <a href="/contact" className="text-primary-600 hover:underline">our contact page</a>.</p>
      </Section>
    </div>
  );
}
