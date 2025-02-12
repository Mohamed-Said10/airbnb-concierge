import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <svg
          className="absolute right-0 h-full w-48 text-white transform translate-x-1/2"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>
      </div>

      <div className="relative pt-6 pb-16 sm:pb-24 lg:pb-32">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-blue-600 sm:text-base lg:text-sm xl:text-base">
                  Welcome to KoziBnB
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Maximize Your</span>
                  <span className="block text-blue-600">Airbnb Potential</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Let us handle everything from guest communication to cleaning services, while you enjoy passive income from your property. Professional management services tailored to your needs.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <Image
                    src="/hero-image.jpg"
                    alt="Luxury vacation rental interior"
                    width={1000}
                    height={750}
                    className="w-full"
                    priority
                  />
                  <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HeroSection; 