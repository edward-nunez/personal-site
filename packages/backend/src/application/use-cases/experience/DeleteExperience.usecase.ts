import { IExperienceRepository } from '../../../domain/interfaces/IExperienceRepository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Use case: Delete experience entry
 */
export class DeleteExperienceUseCase {
  constructor(private experienceRepository: IExperienceRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.experienceRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Experience', id);
    }
  }
}
