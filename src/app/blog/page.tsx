import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';

export const metadata = {
  title: 'Blog & Resources - KoziBnB',
  description: 'Expert tips and insights about Airbnb property management, guest experiences, and maximizing your rental income.',
};

const BlogPage = () => {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
        </div>
        <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2">
          <div className="bg-gray-50 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h2 className="text-base font-semibold tracking-wide text-blue-600 uppercase">
                Blog & Resources
              </h2>
              <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                Insights for Successful Hosting
              </p>
              <p className="mt-6 text-xl text-gray-500">
                Expert tips, industry insights, and best practices to help you succeed in your Airbnb hosting journey.
              </p>
            </div>
          </div>
          <div className="bg-blue-600 py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center">
            <div className="max-w-lg mx-auto lg:max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Stay Updated
              </h3>
              <p className="mt-3 text-lg text-blue-200">
                Subscribe to our newsletter for the latest tips and trends in property management and guest experiences.
              </p>
              <div className="mt-8">
                <form className="sm:flex">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                    placeholder="Enter your email"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <Image
              className="w-full rounded-lg shadow-lg"
              src={featuredPost.image}
              alt={featuredPost.title}
              width={800}
              height={600}
            />
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="text-sm text-blue-600 uppercase tracking-wide font-semibold">
              Featured Article
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="mt-4 block"
            >
              <h3 className="text-3xl font-extrabold text-gray-900">
                {featuredPost.title}
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                {featuredPost.description}
              </p>
            </Link>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <Image
                  className="h-10 w-10 rounded-full"
                  src={featuredPost.author.image}
                  alt={featuredPost.author.name}
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {featuredPost.author.name}
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  <time dateTime={featuredPost.publishedAt}>
                    {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span aria-hidden="true">&middot;</span>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Posts */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
            {otherPosts.map((post) => (
              <article key={post.id} className="flex flex-col">
                <div>
                  <Image
                    className="w-full h-48 rounded-lg object-cover"
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={300}
                  />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                      {post.category}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {post.description}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
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
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 