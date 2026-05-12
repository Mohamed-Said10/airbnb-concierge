export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
} 