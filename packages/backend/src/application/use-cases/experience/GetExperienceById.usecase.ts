import { IExperienceRepository } from '../../../domain/interfaces/IExperienceRepository.js';
import { Experience } from '../../../domain/entities/Experience.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Use case: Get experience by ID
 */
export class GetExperienceByIdUseCase {
  constructor(private experienceRepository: IExperienceRepository) {}

  async execute(id: number): Promise<Experience> {
    const experience = await this.experienceRepository.findById(id);

    if (!experience) {
      throw new NotFoundError('Experience', id);
    }

    return experience;
  }
}
