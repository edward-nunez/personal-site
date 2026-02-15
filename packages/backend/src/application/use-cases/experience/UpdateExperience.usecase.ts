import { IExperienceRepository } from '../../../domain/interfaces/IExperienceRepository.js';
import { Experience, UpdateExperienceInput } from '../../../domain/entities/Experience.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Use case: Update existing experience entry
 */
export class UpdateExperienceUseCase {
  constructor(private experienceRepository: IExperienceRepository) {}

  async execute(data: UpdateExperienceInput): Promise<Experience> {
    const updated = await this.experienceRepository.update(data);

    if (!updated) {
      throw new NotFoundError('Experience', data.id);
    }

    return updated;
  }
}
