'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const checkIcon = (
  <svg className="flex-shrink-0 h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ServicesContent = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Header section */}
      <div className="relative bg-primary-600">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
        </div>
        <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2">
          <div className="bg-gray-50 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h2 className="text-base font-semibold tracking-wide text-primary-600 uppercase">
                {t.services.label}
              </h2>
              <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                {t.services.heading}
              </p>
              <p className="mt-6 text-xl text-gray-500">{t.services.subheading}</p>
            </div>
          </div>
          <div className="bg-primary-600 py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                {t.services.whyChooseUs}
              </h3>
              <p className="mt-3 text-lg text-primary-200">{t.services.whyChooseUsText}</p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                  >
                    {t.services.getStartedToday}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Identity Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 overflow-hidden">
          <div className="px-8 py-10 sm:px-12 sm:py-12 lg:flex lg:items-center lg:gap-12">
            <div className="lg:flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block bg-amber-400 text-primary-900 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                  {t.guestIdentityPromo.badge}
                </span>
                <span className="text-amber-700 text-sm font-medium">{t.guestIdentityPromo.tag}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {t.guestIdentityPromo.title}
              </h3>
              <p className="mt-3 text-gray-600 text-base max-w-xl">
                {t.guestIdentityPromo.description}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { title: t.guestIdentityPromo.detail1Title, text: t.guestIdentityPromo.detail1Text },
                  { title: t.guestIdentityPromo.detail2Title, text: t.guestIdentityPromo.detail2Text },
                  { title: t.guestIdentityPromo.detail3Title, text: t.guestIdentityPromo.detail3Text },
                ].map((d) => (
                  <div key={d.title} className="bg-white border border-amber-100 rounded-lg px-4 py-3">
                    <p className="text-amber-600 text-xs font-semibold uppercase tracking-wide">{d.title}</p>
                    <p className="mt-1 text-gray-500 text-sm">{d.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
              <Link
                href="/guest-identity"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-base hover:bg-primary-700 transition-colors shadow-md"
              >
                {t.guestIdentityPromo.cta} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service cards section */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {t.services.items.map((service) => (
            <div
              key={service.title}
              className={`rounded-lg shadow-lg overflow-hidden ${
                service.highlighted ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="mt-4 text-gray-500">{service.description}</p>
                <ul className="mt-6 space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex">
                      {checkIcon}
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className={`block w-full px-4 py-2 text-center rounded-md shadow ${
                      service.highlighted
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    }`}
                  >
                    {service.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{t.services.faq.heading}</h2>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {t.services.faq.items.map((item) => (
                <div key={item.question}>
                  <dt className="text-lg font-medium text-gray-900">{item.question}</dt>
                  <dd className="mt-2 text-base text-gray-500">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesContent;
