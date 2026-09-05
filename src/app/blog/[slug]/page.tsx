import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';
import { Metadata } from 'next';
import { hreflangAlternates } from '@/lib/seo';
import BlogPostContent from './BlogPostContent';

type PageParams = {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((post) => post.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found - KoziBnB',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - KoziBnB Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}`, languages: hreflangAlternates(`/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.image, width: 1200, height: 600, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: PageParams) {
  const resolvedParams = await params;
  const post = blogPosts.find((post) => post.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kozibnb.com';
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.image}`,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author.name },
    publisher: { '@type': 'Organization', name: 'KoziBnB' },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
