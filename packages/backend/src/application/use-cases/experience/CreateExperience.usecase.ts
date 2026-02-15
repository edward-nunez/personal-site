import { IExperienceRepository } from '../../../domain/interfaces/IExperienceRepository.js';
import { Experience, CreateExperienceInput } from '../../../domain/entities/Experience.js';

/**
 * Use case: Create new experience entry
 */
export class CreateExperienceUseCase {
  constructor(private experienceRepository: IExperienceRepository) {}

  async execute(data: CreateExperienceInput): Promise<Experience> {
    return await this.experienceRepository.create(data);
  }
}
