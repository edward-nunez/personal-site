import { IExperienceRepository } from '../../../domain/interfaces/IExperienceRepository.js';
import { Experience } from '../../../domain/entities/Experience.js';

/**
 * Use case: Get all experiences
 * Retrieves all experience entries, optionally filtered
 */
export class GetAllExperiencesUseCase {
  constructor(private experienceRepository: IExperienceRepository) {}

  async execute(options?: {
    featured?: boolean;
    orderBy?: 'startDate' | 'order';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Experience[]> {
    return await this.experienceRepository.findAll(options);
  }
}
