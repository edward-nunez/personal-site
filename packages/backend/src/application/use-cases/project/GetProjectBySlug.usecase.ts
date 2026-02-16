import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { Project } from '../../../domain/entities/Project.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Get project by slug
 */
export class GetProjectBySlugUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(slug: string): Promise<Project> {
    const project = await this.projectRepository.findBySlug(slug);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }
}
