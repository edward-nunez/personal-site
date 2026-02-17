import type { ToolkitCategory } from '../entities/ToolkitCategory.js';

export interface IToolkitCategoryRepository {
  /**
   * Find all toolkit categories ordered by order ascending.
   */
  findAll(): Promise<ToolkitCategory[]>;
}
