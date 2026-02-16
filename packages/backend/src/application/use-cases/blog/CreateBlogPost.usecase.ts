import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';
import { BlogPost, CreateBlogPostInput } from '../../../domain/entities/BlogPost.js';

/**
 * Use case: Create new blog post
 */
export class CreateBlogPostUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(data: CreateBlogPostInput): Promise<BlogPost> {
    return await this.blogPostRepository.create(data);
  }
}
