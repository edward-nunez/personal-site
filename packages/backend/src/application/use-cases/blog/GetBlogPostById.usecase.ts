import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';
import { BlogPost } from '../../../domain/entities/BlogPost.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Get blog post by ID
 */
export class GetBlogPostByIdUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(id: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findById(id);

    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }

    return blogPost;
  }
}
