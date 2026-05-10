import type { Metadata } from 'next';
import BlogContent from '@/components/sections/BlogContent';

export const metadata: Metadata = {
  title: 'Blog & Resources - KoziBnB',
  description: 'Expert tips and insights about Airbnb property management, guest experiences, and maximizing your rental income.',
};

const BlogPage = () => {
  return <BlogContent />;
};

export default BlogPage;
