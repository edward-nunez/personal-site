import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';
import { BlogPost } from '../../../domain/entities/BlogPost.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Get blog post by slug
 */
export class GetBlogPostBySlugUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(slug: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findBySlug(slug);

    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }

    return blogPost;
  }
}
