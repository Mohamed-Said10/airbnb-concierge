import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Maximizing Your Airbnb Revenue: 10 Pro Tips',
    description: 'Learn the top strategies used by successful Airbnb hosts to maximize their rental income while providing exceptional guest experiences.',
    content: `
      As the short-term rental market continues to grow, hosts need to stay competitive and maximize their property's potential. Here are our top 10 tips for increasing your Airbnb revenue...

      1. Optimize Your Pricing Strategy
      Dynamic pricing is key to maximizing your revenue. Consider factors like seasonality, local events, and demand patterns...

      2. Enhance Your Property Photos
      Professional photography can make your listing stand out. Ensure your photos showcase your property's best features...

      [Rest of the content...]
    `,
    author: {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: '/team/sarah.jpeg'
    },
    publishedAt: '2024-02-10',
    readTime: '8 min read',
    category: 'Property Management',
    image: '/blog/maximize-revenue.jpeg',
    slug: 'maximizing-your-airbnb-revenue-10-pro-tips'
  },
  {
    id: '2',
    title: 'Creating the Perfect Guest Experience',
    description: 'Discover how to create memorable stays that lead to five-star reviews and repeat bookings.',
    content: `
      The key to successful Airbnb hosting lies in providing exceptional guest experiences. Here's how to make every stay memorable...

      1. First Impressions Matter
      From the moment guests arrive, ensure your property is spotless and welcoming...

      2. Clear Communication
      Establish clear lines of communication and provide detailed check-in instructions...

      [Rest of the content...]
    `,
    author: {
      name: 'Emma Rodriguez',
      role: 'Guest Relations Manager',
      image: '/team/emma.jpeg'
    },
    publishedAt: '2024-02-08',
    readTime: '6 min read',
    category: 'Guest Experience',
    image: '/blog/guest-experience.jpeg',
    slug: 'creating-the-perfect-guest-experience'

  },
  {
    id: '3',
    title: 'Essential Cleaning and Maintenance Tips',
    description: 'A comprehensive guide to maintaining your property in top condition for every guest.',
    content: `
      Regular cleaning and maintenance are crucial for successful Airbnb hosting. Here's your complete guide...

      1. Creating a Cleaning Checklist
      Develop a comprehensive cleaning checklist that covers every aspect of your property...

      2. Preventive Maintenance
      Regular inspections and maintenance can prevent costly repairs...

      [Rest of the content...]
    `,
    author: {
      name: 'David Kim',
      role: 'Property Management Specialist',
      image: '/team/david.jpeg'
    },
    publishedAt: '2024-02-05',
    readTime: '7 min read',
    category: 'Maintenance',
    image: '/blog/cleaning-maintenance.jpeg',
    slug: 'essential-cleaning-and-maintenance-tips'
  }
]; 