import type { IToolkitCategoryRepository } from '../../../domain/interfaces/IToolkitCategoryRepository.js';
import type { ToolkitCategory } from '../../../domain/entities/ToolkitCategory.js';

/**
 * Use case: Get all toolkit categories for the TOOL_KIT section.
 * Returns strong, moderate, gaps in display order.
 */
export class GetAllToolkitCategoriesUseCase {
  constructor(private repository: IToolkitCategoryRepository) {}

  async execute(): Promise<ToolkitCategory[]> {
    return await this.repository.findAll();
  }
}
