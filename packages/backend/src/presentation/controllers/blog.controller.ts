import { Request, Response, NextFunction } from 'express';
import { DrizzleBlogPostRepository } from '../../infrastructure/repositories/DrizzleBlogPostRepository.js';
import {
  GetAllBlogPostsUseCase,
  GetBlogPostByIdUseCase,
  GetBlogPostBySlugUseCase,
  CreateBlogPostUseCase,
  UpdateBlogPostUseCase,
  DeleteBlogPostUseCase,
  IncrementBlogPostViewsUseCase,
} from '../../application/use-cases/blog/index.js';
import { CreateBlogPostSchema, UpdateBlogPostSchema } from '../../application/dtos/blog.dto.js';

/**
 * BlogPost Controller
 * Handles HTTP requests for BlogPost resources
 */
export class BlogController {
  private repository = new DrizzleBlogPostRepository();

  /**
   * GET /api/blog
   * Get all blog posts
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllBlogPostsUseCase(this.repository);

      const options = {
        published:
          req.query.published === 'true'
            ? true
            : req.query.published === 'false'
              ? false
              : undefined,
        featured: req.query.featured === 'true' ? true : undefined,
        category: req.query.category as string | undefined,
        tag: req.query.tag as string | undefined,
        orderBy: (req.query.orderBy as 'publishedAt' | 'createdAt' | 'views') || 'publishedAt',
        orderDirection: (req.query.orderDirection as 'asc' | 'desc') || 'desc',
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const blogPosts = await useCase.execute(options);

      res.json({
        success: true,
        data: blogPosts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/:id
   * Get blog post by ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const useCase = new GetBlogPostByIdUseCase(this.repository);

      const blogPost = await useCase.execute(id);

      res.json({
        success: true,
        data: blogPost,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/slug/:slug
   * Get blog post by slug (and increment views)
   */
  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const getUseCase = new GetBlogPostBySlugUseCase(this.repository);

      const blogPost = await getUseCase.execute(slug);

      // Increment view count asynchronously (don't wait)
      const incrementUseCase = new IncrementBlogPostViewsUseCase(this.repository);
      incrementUseCase.execute(blogPost.id).catch((err) => {
        console.error('Failed to increment blog post views:', err);
      });

      res.json({
        success: true,
        data: blogPost,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/blog
   * Create new blog post (admin only)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateBlogPostSchema.parse(req.body);
      const useCase = new CreateBlogPostUseCase(this.repository);

      // Convert date strings to Date objects
      const inputData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
      };

      const blogPost = await useCase.execute(inputData);

      res.status(201).json({
        success: true,
        data: blogPost,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/blog/:id
   * Update blog post (admin only)
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const validatedData = UpdateBlogPostSchema.parse(req.body);
      const useCase = new UpdateBlogPostUseCase(this.repository);

      // Convert date strings to Date objects
      const inputData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
      };

      const blogPost = await useCase.execute({ id, ...inputData });

      res.json({
        success: true,
        data: blogPost,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/blog/:id
   * Delete blog post (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const useCase = new DeleteBlogPostUseCase(this.repository);

      await useCase.execute(id);

      res.json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
