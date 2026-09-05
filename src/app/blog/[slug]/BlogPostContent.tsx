'use client';

import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { BlogPost, localizedPost } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  const localized = localizedPost(post, language);
  const dateLocale = french ? 'fr-FR' : 'en-US';

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-primary-600 font-semibold tracking-wide uppercase">
                {localized.category}
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {localized.title}
              </span>
            </h1>
            <div className="mt-8 flex items-center justify-center">
              <div className="flex-shrink-0">
                <Image
                  className="h-10 w-10 rounded-full"
                  src={post.author.image}
                  alt={post.author.name}
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {post.author.name}
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span aria-hidden="true">&middot;</span>
                  <span>{localized.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Image
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              src={post.image}
              alt={localized.title}
              width={1200}
              height={600}
              priority
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative py-16 overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-blue mx-auto">
            <div className="space-y-6">
              {localized.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary-600 px-8 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {french ? 'Vous voulez que ce soit géré pour vous ?' : 'Want this handled for you?'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-100">
            {french
              ? 'Découvrez comment KoziBnB gère l\'enregistrement des invités, la conformité et les opérations quotidiennes pour les hôtes Airbnb à travers le Maroc.'
              : 'See how KoziBnB manages guest registration, compliance, and day-to-day operations for Airbnb hosts across Morocco.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-base font-medium text-primary-600 hover:bg-primary-50"
            >
              {french ? 'Découvrir nos services' : 'Explore our services'}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white px-5 py-3 text-base font-medium text-white hover:bg-primary-700"
            >
              {french ? 'Nous contacter' : 'Contact us'}
            </Link>
          </div>
        </div>
      </div>

      {/* Related posts */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {french ? 'Articles connexes' : 'Related Articles'}
            </h2>
          </div>
          <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {blogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => {
                const relatedLocalized = localizedPost(relatedPost, language);
                return (
                  <article key={relatedPost.id} className="flex flex-col">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="relative w-full">
                        <Image
                          className="w-full h-48 rounded-lg object-cover"
                          src={relatedPost.image}
                          alt={relatedLocalized.title}
                          width={400}
                          height={300}
                        />
                      </div>
                      <div className="flex-1 bg-white p-6">
                        <p className="text-sm font-medium text-primary-600">
                          {relatedLocalized.category}
                        </p>
                        <div className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">
                            {relatedLocalized.title}
                          </p>
                          <p className="mt-3 text-base text-gray-500">
                            {relatedLocalized.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
