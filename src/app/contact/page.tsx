'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'apartment',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', propertyType: 'apartment', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white">
      <div className="relative bg-primary-600">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
        </div>
        <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2">
          <div className="bg-gray-50 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h2 className="text-base font-semibold tracking-wide text-primary-600 uppercase">
                {t.contact.label}
              </h2>
              <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                {t.contact.heading}
              </p>
              <p className="mt-6 text-xl text-gray-500">{t.contact.subheading}</p>
            </div>
          </div>
          <div className="bg-primary-600 py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">{t.contact.office}</h3>
              <p className="mt-3 text-lg text-primary-200">{t.contact.address}</p>
              <div className="mt-8 space-y-3 text-primary-200">
                <p className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t.contact.phone}
                </p>
                <p className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.contact.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t.contact.form.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                  {t.contact.form.propertyType}
                </label>
                <select
                  name="propertyType"
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="apartment">{t.contact.form.propertyTypes.apartment}</option>
                  <option value="house">{t.contact.form.propertyTypes.house}</option>
                  <option value="condo">{t.contact.form.propertyTypes.condo}</option>
                  <option value="villa">{t.contact.form.propertyTypes.villa}</option>
                  <option value="other">{t.contact.form.propertyTypes.other}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {t.contact.form.message}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{t.contact.errorMessage}</p>}
              {submitted && (
                <p className="text-sm text-green-600 font-medium">✓ {t.contact.successMessage}</p>
              )}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {submitting ? '...' : t.contact.form.send}
                </button>
              </div>
            </form>
          </div>

          {/* Google Maps — Casablanca */}
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.3!2d-7.5898!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4786b2e05b%3A0x1e8b8e1a4e4a1b2a!2sBoulevard%20Mohammed%20V%2C%20Casablanca!5e0!3m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
