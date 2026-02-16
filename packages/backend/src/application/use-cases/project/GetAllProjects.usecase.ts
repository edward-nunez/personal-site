import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { Project } from '../../../domain/entities/Project.js';

/**
 * Use case: Get all projects with optional filtering
 */
export class GetAllProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(options?: {
    featured?: boolean;
    category?: string;
    status?: string;
    orderBy?: 'createdAt' | 'order' | 'startDate';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Project[]> {
    return await this.projectRepository.findAll(options);
  }
}
