export interface BlogPost {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  content: string;
  contentFr: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  publishedAt: string;
  readTime: string;
  readTimeFr: string;
  category: string;
  categoryFr: string;
  image: string;
  slug: string;
}

export function localizedPost(post: BlogPost, language: 'en' | 'fr') {
  if (language === 'fr') {
    return {
      title: post.titleFr,
      description: post.descriptionFr,
      content: post.contentFr,
      category: post.categoryFr,
      readTime: post.readTimeFr,
    };
  }
  return {
    title: post.title,
    description: post.description,
    content: post.content,
    category: post.category,
    readTime: post.readTime,
  };
}