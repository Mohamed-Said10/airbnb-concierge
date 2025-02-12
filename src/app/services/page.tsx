import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services - AirConcierge',
  description: 'Comprehensive Airbnb management services including property management, guest communication, cleaning services, and revenue optimization.',
};

const ServicesPage = () => {
  const services = [
    {
      title: 'Full Property Management',
      description: 'End-to-end management of your Airbnb property',
      features: [
        'Professional listing creation and optimization',
        'Dynamic pricing strategy',
        '24/7 guest communication',
        'Check-in/check-out management',
        'Professional cleaning coordination',
        'Maintenance and repairs handling',
        'Monthly performance reports',
        'Professional photography',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      title: 'Guest Communication',
      description: 'Professional guest interaction service',
      features: [
        '24/7 guest support',
        'Multilingual communication',
        'Quick response times',
        'Check-in instructions',
        'Local recommendations',
        'Issue resolution',
        'Guest screening',
        'Review management',
      ],
      cta: 'Learn More',
      highlighted: false,
    },
    {
      title: 'Cleaning & Maintenance',
      description: 'Keep your property in perfect condition',
      features: [
        'Professional cleaning service',
        'Quality inspection',
        'Inventory management',
        'Supplies restocking',
        'Maintenance coordination',
        'Emergency repairs',
        'Regular property checks',
        'Damage reporting',
      ],
      cta: 'Contact Us',
      highlighted: false,
    },
  ];

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
                Our Services
              </h2>
              <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                Professional Airbnb Management
              </p>
              <p className="mt-6 text-xl text-gray-500">
                We offer comprehensive property management services to help you maximize your Airbnb rental income while minimizing your time investment.
              </p>
            </div>
          </div>
          <div className="bg-blue-600 py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Why Choose Us?
              </h3>
              <p className="mt-3 text-lg text-blue-200">
                Our team of experienced professionals handles everything from guest communication to property maintenance, allowing you to earn passive income without the hassle of day-to-day management.
              </p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Get Started Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service cards section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
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
                      <svg
                        className="flex-shrink-0 h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
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
          <h2 className="text-3xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  What percentage of rental income do you charge?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Our fees are competitive and based on your property&apos;s location and requirements. Contact us for a personalized quote.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  How do you handle maintenance issues?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  We have a network of trusted contractors and handle all maintenance issues promptly. We&apos;ll notify you of any major repairs needed.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  Can I still use my property occasionally?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes! You can block off dates for personal use through our management system anytime.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  How do you screen guests?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  We use Airbnb&apos;s verification system and our own screening process to ensure quality guests for your property.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 