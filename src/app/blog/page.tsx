import type { Metadata } from 'next';
import BlogContent from '@/components/sections/BlogContent';
import { hreflangAlternates } from '@/lib/seo';

const title = 'Blog & Resources - KoziBnB';
const description = 'Expert tips and insights about Airbnb property management, guest experiences, and maximizing your rental income.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog', languages: hreflangAlternates('/blog') },
  openGraph: { title, description },
  twitter: { title, description },
};

const BlogPage = () => {
  return <BlogContent />;
};

export default BlogPage;
