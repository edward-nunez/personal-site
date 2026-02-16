/**
 * BlogPost Domain Entity
 * Represents a blog article or post
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category: string;
  tags: string[];
  coverImage?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  featured: boolean;
  views: number;
  readTime?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating new blog post
 */
export interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category: string;
  tags?: string[];
  coverImage?: string | null;
  published?: boolean;
  publishedAt?: Date | null;
  featured?: boolean;
  readTime?: number | null;
}

/**
 * DTO for updating blog post
 */
export interface UpdateBlogPostInput {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  category?: string;
  tags?: string[];
  coverImage?: string | null;
  published?: boolean;
  publishedAt?: Date | null;
  featured?: boolean;
  readTime?: number | null;
}
