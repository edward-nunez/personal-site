import { prisma } from '../persistence/prismaClient.js';
import { IBlogPostRepository } from '../../domain/interfaces/IBlogPostRepository.js';
import {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '../../domain/entities/BlogPost.js';
import logger from '../../shared/utils/logger.js';

/**
 * Prisma implementation of BlogPost Repository
 */
export class PrismaBlogPostRepository implements IBlogPostRepository {
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
    const where: {
      published?: boolean;
      featured?: boolean;
      category?: string;
      tags?: { has: string };
    } = {};
    if (options?.published !== undefined) where.published = options.published;
    if (options?.featured !== undefined) where.featured = options.featured;
    if (options?.category) where.category = options.category;
    if (options?.tag) where.tags = { has: options.tag };

    const orderByField = options?.orderBy || 'publishedAt';
    const orderDirection = options?.orderDirection || 'desc';

    return await prisma.blogPost.findMany({
      where,
      orderBy: { [orderByField]: orderDirection },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async findById(id: number): Promise<BlogPost | null> {
    return await prisma.blogPost.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    return await prisma.blogPost.findUnique({
      where: { slug },
    });
  }

  async findByCategory(category: string): Promise<BlogPost[]> {
    return await prisma.blogPost.findMany({
      where: {
        category,
        published: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findByTag(tag: string): Promise<BlogPost[]> {
    return await prisma.blogPost.findMany({
      where: {
        tags: { has: tag },
        published: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async search(keyword: string): Promise<BlogPost[]> {
    const lowerKeyword = keyword.toLowerCase();

    return await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: lowerKeyword, mode: 'insensitive' } },
          { content: { contains: lowerKeyword, mode: 'insensitive' } },
          { excerpt: { contains: lowerKeyword, mode: 'insensitive' } },
          { tags: { has: keyword } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async create(data: CreateBlogPostInput): Promise<BlogPost> {
    return await prisma.blogPost.create({
      data: {
        ...data,
        tags: data.tags || [],
        published: data.published ?? false,
        featured: data.featured ?? false,
        views: 0,
      },
    });
  }

  async update(data: UpdateBlogPostInput): Promise<BlogPost | null> {
    const { id, ...updateData } = data;

    try {
      return await prisma.blogPost.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      logger.error('Error updating blog post:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.blogPost.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error deleting blog post:', error);
      return false;
    }
  }

  async incrementViews(id: number): Promise<void> {
    await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async getCategories(): Promise<string[]> {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
    });
    return posts.map((p) => p.category);
  }

  async getTags(): Promise<string[]> {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { tags: true },
    });

    const allTags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => allTags.add(tag)));

    return Array.from(allTags);
  }

  async count(options?: { published?: boolean; category?: string }): Promise<number> {
    const where: { published?: boolean; category?: string } = {};
    if (options?.published !== undefined) where.published = options.published;
    if (options?.category) where.category = options.category;

    return await prisma.blogPost.count({ where });
  }
}
