'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const checkIcon = (
  <svg className="flex-shrink-0 h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ServicesContent = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Header section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
        </div>
        <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2">
          <div className="bg-gray-50 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h2 className="text-base font-semibold tracking-wide text-blue-600 uppercase">
                {t.services.label}
              </h2>
              <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                {t.services.heading}
              </p>
              <p className="mt-6 text-xl text-gray-500">{t.services.subheading}</p>
            </div>
          </div>
          <div className="bg-blue-600 py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                {t.services.whyChooseUs}
              </h3>
              <p className="mt-3 text-lg text-blue-200">{t.services.whyChooseUsText}</p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                    {t.services.getStartedToday}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Registration featured section */}
      <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <circle cx="350" cy="50" r="120" stroke="white" strokeWidth="40" />
              <circle cx="50" cy="160" r="80" stroke="white" strokeWidth="30" />
            </svg>
          </div>
          <div className="relative px-8 py-10 sm:px-12 sm:py-12 lg:flex lg:items-start lg:gap-12">
            {/* Icon */}
            <div className="hidden lg:flex shrink-0 w-16 h-16 rounded-2xl bg-white/10 items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.417 2 2.83V19h-2v-1" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                  {t.guestIdentityPromo.badge}
                </span>
                <span className="text-blue-200 text-xs font-semibold uppercase tracking-wide">
                  {t.guestIdentityPromo.tag}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {t.guestIdentityPromo.title}
              </h3>
              <p className="text-blue-100 text-base leading-relaxed max-w-2xl mb-8">
                {t.guestIdentityPromo.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {[
                  { title: t.guestIdentityPromo.detail1Title, text: t.guestIdentityPromo.detail1Text },
                  { title: t.guestIdentityPromo.detail2Title, text: t.guestIdentityPromo.detail2Text },
                  { title: t.guestIdentityPromo.detail3Title, text: t.guestIdentityPromo.detail3Text },
                ].map((d) => (
                  <div key={d.title} className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-semibold text-sm mb-1">{d.title}</p>
                    <p className="text-blue-200 text-xs leading-relaxed">{d.text}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/guest-identity"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition-colors text-sm"
              >
                {t.guestIdentityPromo.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service cards section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {t.services.items.map((service) => (
            <div
              key={service.title}
              className={`rounded-lg shadow-lg overflow-hidden ${
                service.highlighted ? 'ring-2 ring-blue-600' : ''
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
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
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
