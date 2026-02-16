import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';

/**
 * Use case: Increment blog post view count
 */
export class IncrementBlogPostViewsUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(id: string): Promise<void> {
    await this.blogPostRepository.incrementViews(id);
  }
}
