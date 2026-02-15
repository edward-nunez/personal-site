import { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '../entities/BlogPost.js';

/**
 * BlogPost Repository Interface
 * Defines contract for BlogPost data access operations
 */
export interface IBlogPostRepository {
  /**
   * Find all blog posts
   * @param options Optional filtering/sorting options
   */
  findAll(options?: {
    published?: boolean;
    featured?: boolean;
    category?: string;
    tag?: string;
    orderBy?: 'publishedAt' | 'createdAt' | 'views';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]>;

  /**
   * Find blog post by ID
   * @param id Blog post ID
   */
  findById(id: number): Promise<BlogPost | null>;

  /**
   * Find blog post by slug
   * @param slug Blog post slug
   */
  findBySlug(slug: string): Promise<BlogPost | null>;

  /**
   * Find blog posts by category
   * @param category Category name
   */
  findByCategory(category: string): Promise<BlogPost[]>;

  /**
   * Find blog posts by tag
   * @param tag Tag name
   */
  findByTag(tag: string): Promise<BlogPost[]>;

  /**
   * Search blog posts by keyword
   * @param keyword Search keyword
   */
  search(keyword: string): Promise<BlogPost[]>;

  /**
   * Create new blog post
   * @param data Blog post creation data
   */
  create(data: CreateBlogPostInput): Promise<BlogPost>;

  /**
   * Update existing blog post
   * @param data Blog post update data
   */
  update(data: UpdateBlogPostInput): Promise<BlogPost | null>;

  /**
   * Delete blog post by ID
   * @param id Blog post ID
   */
  delete(id: number): Promise<boolean>;

  /**
   * Increment view count
   * @param id Blog post ID
   */
  incrementViews(id: number): Promise<void>;

  /**
   * Get all unique categories
   */
  getCategories(): Promise<string[]>;

  /**
   * Get all unique tags
   */
  getTags(): Promise<string[]>;

  /**
   * Count total blog posts
   */
  count(options?: { published?: boolean; category?: string }): Promise<number>;
}
