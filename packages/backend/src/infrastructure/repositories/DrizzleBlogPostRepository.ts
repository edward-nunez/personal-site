import {
  eq,
  and,
  or,
  ilike,
  arrayContains,
  count as drizzleCount,
  asc,
  desc,
  sql,
} from 'drizzle-orm';
import { db } from '../persistence/db.js';
import { blogPosts } from '../persistence/schema.js';
import { IBlogPostRepository } from '../../domain/interfaces/IBlogPostRepository.js';
import {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '../../domain/entities/BlogPost.js';
import logger from '../../shared/utils/logger.js';

/**
 * Drizzle implementation of BlogPost Repository
 */
export class DrizzleBlogPostRepository implements IBlogPostRepository {
  async findAll(options?: {
    published?: boolean;
    featured?: boolean;
    category?: string;
    tag?: string;
    orderBy?: 'publishedAt' | 'createdAt' | 'views';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]> {
    const conditions = [];
    if (options?.published !== undefined)
      conditions.push(eq(blogPosts.published, options.published));
    if (options?.featured !== undefined) conditions.push(eq(blogPosts.featured, options.featured));
    if (options?.category) conditions.push(eq(blogPosts.category, options.category));
    if (options?.tag) conditions.push(arrayContains(blogPosts.tags, [options.tag]));

    const orderByField = options?.orderBy || 'publishedAt';
    const orderDirection = options?.orderDirection || 'desc';
    const colMap = {
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      views: blogPosts.views,
    } as const;
    const col = colMap[orderByField];
    const orderFn = orderDirection === 'asc' ? asc(col) : desc(col);

    let query = db
      .select()
      .from(blogPosts)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderFn)
      .$dynamic();

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.offset(options.offset);

    return await query;
  }

  async findById(id: string): Promise<BlogPost | null> {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return rows[0] ?? null;
  }

  async findByCategory(category: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.category, category), eq(blogPosts.published, true)))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async findByTag(tag: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(arrayContains(blogPosts.tags, [tag]), eq(blogPosts.published, true)))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async search(keyword: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          or(
            ilike(blogPosts.title, `%${keyword}%`),
            ilike(blogPosts.content, `%${keyword}%`),
            ilike(blogPosts.excerpt, `%${keyword}%`),
            arrayContains(blogPosts.tags, [keyword])
          )
        )
      )
      .orderBy(desc(blogPosts.publishedAt));
  }

  async create(data: CreateBlogPostInput): Promise<BlogPost> {
    const rows = await db
      .insert(blogPosts)
      .values({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt ?? null,
        category: data.category,
        tags: data.tags || [],
        coverImage: data.coverImage ?? null,
        published: data.published ?? false,
        publishedAt: data.publishedAt ?? null,
        featured: data.featured ?? false,
        readTime: data.readTime ?? null,
        views: 0,
      })
      .returning();
    return rows[0];
  }

  async update(data: UpdateBlogPostInput): Promise<BlogPost | null> {
    const { id, ...updateData } = data;

    try {
      const rows = await db
        .update(blogPosts)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning();
      return rows[0] ?? null;
    } catch (error) {
      logger.error('Error updating blog post:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, id))
        .returning({ id: blogPosts.id });
      return rows.length > 0;
    } catch (error) {
      logger.error('Error deleting blog post:', error);
      return false;
    }
  }

  async incrementViews(id: string): Promise<void> {
    await db
      .update(blogPosts)
      .set({ views: sql`${blogPosts.views} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async getCategories(): Promise<string[]> {
    const rows = await db
      .selectDistinct({ category: blogPosts.category })
      .from(blogPosts)
      .where(eq(blogPosts.published, true));
    return rows.map((r) => r.category);
  }

  async getTags(): Promise<string[]> {
    const rows = await db
      .select({ tags: blogPosts.tags })
      .from(blogPosts)
      .where(eq(blogPosts.published, true));

    const allTags = new Set<string>();
    rows.forEach((row) => row.tags.forEach((tag) => allTags.add(tag)));
    return Array.from(allTags);
  }

  async count(options?: { published?: boolean; category?: string }): Promise<number> {
    const conditions = [];
    if (options?.published !== undefined)
      conditions.push(eq(blogPosts.published, options.published));
    if (options?.category) conditions.push(eq(blogPosts.category, options.category));

    const rows = await db
      .select({ value: drizzleCount() })
      .from(blogPosts)
      .where(conditions.length ? and(...conditions) : undefined);
    return rows[0].value;
  }
}
