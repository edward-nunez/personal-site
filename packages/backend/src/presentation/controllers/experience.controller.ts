import { Request, Response, NextFunction } from 'express';
import { PrismaExperienceRepository } from '../../infrastructure/repositories/PrismaExperienceRepository.js';
import {
  GetAllExperiencesUseCase,
  GetExperienceByIdUseCase,
  CreateExperienceUseCase,
  UpdateExperienceUseCase,
  DeleteExperienceUseCase,
} from '../../application/use-cases/experience/index.js';
import {
  CreateExperienceSchema,
  UpdateExperienceSchema,
} from '../../application/dtos/experience.dto.js';

/**
 * Experience Controller
 * Handles HTTP requests for Experience resources
 */
export class ExperienceController {
  private repository = new PrismaExperienceRepository();

  /**
   * GET /api/experiences
   * Get all experiences
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllExperiencesUseCase(this.repository);

      const options = {
        featured: req.query.featured === 'true' ? true : undefined,
        orderBy: (req.query.orderBy as 'startDate' | 'order') || 'startDate',
        orderDirection: (req.query.orderDirection as 'asc' | 'desc') || 'desc',
      };

      const experiences = await useCase.execute(options);

      res.json({
        success: true,
        data: experiences,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/experiences/:id
   * Get experience by ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const useCase = new GetExperienceByIdUseCase(this.repository);

      const experience = await useCase.execute(id);

      res.json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/experiences
   * Create new experience (admin only)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateExperienceSchema.parse(req.body);
      const useCase = new CreateExperienceUseCase(this.repository);

      // Convert date strings to Date objects
      const inputData = {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      };

      const experience = await useCase.execute(inputData);

      res.status(201).json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/experiences/:id
   * Update experience (admin only)
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const validatedData = UpdateExperienceSchema.parse(req.body);
      const useCase = new UpdateExperienceUseCase(this.repository);

      // Convert date strings to Date objects
      const inputData = {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      };

      const experience = await useCase.execute({ id, ...inputData });

      res.json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/experiences/:id
   * Delete experience (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const useCase = new DeleteExperienceUseCase(this.repository);

      await useCase.execute(id);

      res.json({
        success: true,
        message: 'Experience deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
