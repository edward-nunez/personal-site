import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Delete project
 */
export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.projectRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Project not found');
    }
  }
}
