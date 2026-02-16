import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';
import { BlogPost, UpdateBlogPostInput } from '../../../domain/entities/BlogPost.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Update existing blog post
 */
export class UpdateBlogPostUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(data: UpdateBlogPostInput): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.update(data);

    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }

    return blogPost;
  }
}
