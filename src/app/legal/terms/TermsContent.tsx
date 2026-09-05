'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function TermsContent() {
  const { language } = useLanguage();
  const french = language === 'fr';

  if (french) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <Link href="/" className="text-primary-600 hover:underline text-sm">← Retour à l'accueil</Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">Conditions d'utilisation</h1>
          <p className="text-sm text-gray-400">Dernière mise à jour : juin 2026</p>
        </div>

        <Section title="1. Acceptation des conditions">
          <p>En accédant à KoziBnB ou en l'utilisant (« le Service »), vous acceptez d'être lié par ces Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service.</p>
        </Section>

        <Section title="2. Description du service">
          <p>KoziBnB est une plateforme de gestion locative qui permet aux hôtes de locations de courte durée de recueillir des enregistrements numériques d'invités, de gérer les documents d'identité des invités et de se conformer aux réglementations touristiques locales, y compris l'obligation de <em>fiche de police</em> au Maroc.</p>
        </Section>

        <Section title="3. Création de compte">
          <p>Vous devez créer un compte pour utiliser le tableau de bord hôte. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités effectuées sous votre compte. Vous acceptez de fournir des informations exactes et complètes lors de votre inscription.</p>
        </Section>

        <Section title="4. Responsabilités de l'hôte">
          <p>En tant qu'hôte utilisant KoziBnB, vous êtes responsable de :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Vous assurer que votre utilisation des données d'invités collectées respecte les lois locales et réglementations touristiques applicables.</li>
            <li>Garder les données d'identité des invités confidentielles et sécurisées.</li>
            <li>Informer les invités que leurs informations seront collectées et conservées à des fins de conformité réglementaire.</li>
            <li>Respecter toutes les lois de protection des données applicables, y compris le RGPD le cas échéant.</li>
          </ul>
        </Section>

        <Section title="5. Données des invités et confidentialité">
          <p>KoziBnB stocke les données d'enregistrement des invités pour votre compte. Ces données comprennent des informations personnelles telles que le nom complet, la date de naissance, la nationalité et les détails du document d'identité. Vous ne pouvez utiliser ces données à aucune autre fin que la conformité réglementaire et la gestion locative.</p>
          <p>Nous mettons en œuvre des mesures de sécurité conformes aux standards du secteur pour protéger les données stockées. Cependant, vous reconnaissez qu'aucune méthode de transmission sur Internet n'est sécurisée à 100 %.</p>
        </Section>

        <Section title="6. Utilisations interdites">
          <p>Vous acceptez de ne pas utiliser le Service pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Collecter des données d'invités à des fins autres que la conformité légale et la gestion locative.</li>
            <li>Vendre, partager ou divulguer des informations personnelles d'invités à des tiers.</li>
            <li>Enfreindre toute loi ou réglementation applicable.</li>
            <li>Tenter d'accéder sans autorisation au Service ou à ses systèmes.</li>
          </ul>
        </Section>

        <Section title="7. Limitation de responsabilité">
          <p>KoziBnB est fourni « tel quel » sans garantie d'aucune sorte. Nous ne sommes pas responsables des dommages indirects, accessoires ou consécutifs résultant de votre utilisation du Service, y compris, sans s'y limiter, les amendes réglementaires résultant d'un non-respect des règles.</p>
        </Section>

        <Section title="8. Résiliation">
          <p>Nous nous réservons le droit de suspendre ou de résilier votre compte à notre discrétion si vous enfreignez ces Conditions d'utilisation. Vous pouvez supprimer votre compte à tout moment en nous contactant.</p>
        </Section>

        <Section title="9. Modifications des conditions">
          <p>Nous pouvons mettre à jour ces Conditions d'utilisation de temps à autre. Nous vous informerons de tout changement important par e-mail ou via la plateforme. La poursuite de l'utilisation du Service après modification vaut acceptation des conditions mises à jour.</p>
        </Section>

        <Section title="10. Contact">
          <p>Pour toute question concernant ces Conditions d'utilisation, veuillez nous contacter via <a href="/contact" className="text-primary-600 hover:underline">notre page de contact</a>.</p>
        </Section>
      </div>
    );
  }

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
