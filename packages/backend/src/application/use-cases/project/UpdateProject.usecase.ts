import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { Project, UpdateProjectInput } from '../../../domain/entities/Project.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Update existing project
 */
export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(data: UpdateProjectInput): Promise<Project> {
    const project = await this.projectRepository.update(data);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }
}
