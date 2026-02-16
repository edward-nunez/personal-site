import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';
import { BlogPost } from '../../../domain/entities/BlogPost.js';

/**
 * Use case: Get all blog posts with optional filtering
 */
export class GetAllBlogPostsUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(options?: {
    published?: boolean;
    featured?: boolean;
    category?: string;
    tag?: string;
    orderBy?: 'publishedAt' | 'createdAt' | 'views';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]> {
    return await this.blogPostRepository.findAll(options);
  }
}
