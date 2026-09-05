'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function PrivacyContent() {
  const { language } = useLanguage();
  const french = language === 'fr';

  if (french) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <Link href="/" className="text-primary-600 hover:underline text-sm">← Retour à l'accueil</Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">Politique de confidentialité</h1>
          <p className="text-sm text-gray-400">Dernière mise à jour : juin 2026</p>
        </div>

        <Section title="1. Qui sommes-nous">
          <p>KoziBnB est une plateforme de gestion locative qui aide les hôtes de locations de courte durée au Maroc à recueillir des enregistrements numériques d'invités et à se conformer à la réglementation touristique locale. Notre adresse et nos coordonnées sont disponibles sur notre <a href="/contact" className="text-primary-600 hover:underline">page de contact</a>.</p>
        </Section>

        <Section title="2. Données que nous collectons">
          <p><strong>Données du compte hôte :</strong> Lors de la création d'un compte, nous collectons votre nom, votre adresse e-mail et votre mot de passe (haché).</p>
          <p><strong>Données de la propriété :</strong> Noms de propriétés, adresses et identifiants de lien d'enregistrement que vous créez.</p>
          <p><strong>Données d'enregistrement des invités :</strong> Informations personnelles soumises par vos invités, notamment nom complet, date de naissance, lieu de naissance, nationalité, type et numéro de document d'identité, date d'expiration, adresse personnelle, et photos des documents d'identité. Ces données sont collectées pour le compte de l'hôte à des fins de conformité réglementaire.</p>
          <p><strong>Données d'utilisation :</strong> Journaux serveur standards incluant les adresses IP, le type de navigateur et les pages consultées.</p>
        </Section>

        <Section title="3. Comment nous utilisons vos données">
          <p>Nous utilisons les données collectées pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fournir et exploiter la plateforme KoziBnB.</li>
            <li>Conserver les enregistrements des invités pour le compte des hôtes, en conformité avec la réglementation touristique marocaine (Dahir n° 1-02-176).</li>
            <li>Envoyer des e-mails transactionnels tels que les notifications de nouveaux enregistrements.</li>
            <li>Améliorer la sécurité et les performances de la plateforme.</li>
          </ul>
          <p>Nous ne vendons, ne louons ni ne partageons vos données ou celles de vos invités avec des tiers à des fins commerciales.</p>
        </Section>

        <Section title="4. Conservation des données">
          <p>Les données d'enregistrement des invités sont conservées aussi longtemps que l'exigent les réglementations touristiques applicables. Les hôtes peuvent demander la suppression de leur compte et des données associées en nous contactant. Les données d'invités soumises à des fins de conformité réglementaire peuvent être conservées conformément à la loi.</p>
        </Section>

        <Section title="5. Sécurité des données">
          <p>Nous stockons les données sur Supabase, un fournisseur de base de données cloud sécurisé avec chiffrement au repos et en transit. Les photos de documents d'identité sont stockées dans un espace privé à accès contrôlé. Nous mettons en œuvre des contrôles d'accès basés sur les rôles pour garantir que seuls les hôtes autorisés peuvent consulter les données de leurs propres invités.</p>
        </Section>

        <Section title="6. Vos droits">
          <p>Selon votre juridiction, vous pouvez avoir le droit de :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Accéder aux données personnelles que nous détenons à votre sujet.</li>
            <li>Demander la correction de données inexactes.</li>
            <li>Demander la suppression de vos données (sous réserve des obligations légales de conservation).</li>
            <li>Vous opposer au traitement de vos données ou en demander la limitation.</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous via notre <a href="/contact" className="text-primary-600 hover:underline">page de contact</a>.</p>
        </Section>

        <Section title="7. Cookies">
          <p>Nous utilisons des cookies de session essentiels pour vous maintenir connecté. Nous n'utilisons pas de cookies de suivi ou publicitaires.</p>
        </Section>

        <Section title="8. Services tiers">
          <p>Nous utilisons les services tiers suivants pour exploiter la plateforme :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase</strong> — base de données, authentification et stockage de fichiers.</li>
            <li><strong>Brevo</strong> — envoi d'e-mails transactionnels.</li>
          </ul>
          <p>Chacun de ces prestataires dispose de sa propre politique de confidentialité et de ses propres accords de traitement des données.</p>
        </Section>

        <Section title="9. Modifications de cette politique">
          <p>Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons de tout changement important par e-mail ou notification dans l'application.</p>
        </Section>

        <Section title="10. Contact">
          <p>Pour toute question ou demande relative à la confidentialité, contactez-nous via notre <a href="/contact" className="text-primary-600 hover:underline">page de contact</a>.</p>
        </Section>
      </div>
    );
  }

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
