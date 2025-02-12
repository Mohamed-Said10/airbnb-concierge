import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';
import { Metadata } from 'next';

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
  };
}

export default async function BlogPost({ params }: PageParams) {
  const resolvedParams = await params;
  const post = blogPosts.find((post) => post.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-blue-600 font-semibold tracking-wide uppercase">
                {post.category}
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {post.title}
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
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.readTime}</span>
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
              alt={post.title}
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
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related posts */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Related Articles
            </h2>
          </div>
          <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {blogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => (
                <article key={relatedPost.id} className="flex flex-col">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative w-full">
                      <Image
                        className="w-full h-48 rounded-lg object-cover"
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        width={400}
                        height={300}
                      />
                    </div>
                    <div className="flex-1 bg-white p-6">
                      <p className="text-sm font-medium text-blue-600">
                        {relatedPost.category}
                      </p>
                      <div className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">
                          {relatedPost.title}
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          {relatedPost.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 