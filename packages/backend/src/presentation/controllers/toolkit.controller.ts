import { Request, Response, NextFunction } from 'express';
import { DrizzleToolkitCategoryRepository } from '../../infrastructure/repositories/DrizzleToolkitCategoryRepository.js';
import { GetAllToolkitCategoriesUseCase } from '../../application/use-cases/toolkit/index.js';

/**
 * Toolkit Controller
 * Serves the TOOL_KIT section: strong, moderate, gaps categories with up to 5 items each.
 */
export class ToolkitController {
  private repository = new DrizzleToolkitCategoryRepository();

  /**
   * GET /api/toolkit
   * Get all toolkit categories in display order.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllToolkitCategoriesUseCase(this.repository);
      const categories = await useCase.execute();
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
