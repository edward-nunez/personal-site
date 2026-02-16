import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { Project, CreateProjectInput } from '../../../domain/entities/Project.js';

/**
 * Use case: Create new project
 */
export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(data: CreateProjectInput): Promise<Project> {
    return await this.projectRepository.create(data);
  }
}
