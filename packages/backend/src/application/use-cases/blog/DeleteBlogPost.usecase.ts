import { IBlogPostRepository } from '../../../domain/interfaces/IBlogPostRepository.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Delete blog post
 */
export class DeleteBlogPostUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.blogPostRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Blog post not found');
    }
  }
}
