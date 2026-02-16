import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { Project } from '../../../domain/entities/Project.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Get project by ID
 */
export class GetProjectByIdUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }
}
