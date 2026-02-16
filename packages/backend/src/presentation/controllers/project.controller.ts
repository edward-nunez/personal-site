import { Request, Response, NextFunction } from 'express';
import { DrizzleProjectRepository } from '../../infrastructure/repositories/DrizzleProjectRepository.js';
import {
  GetAllProjectsUseCase,
  GetProjectByIdUseCase,
  GetProjectBySlugUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '../../application/use-cases/project/index.js';
import { CreateProjectSchema, UpdateProjectSchema } from '../../application/dtos/project.dto.js';

/**
 * Project Controller
 * Handles HTTP requests for Project resources
 */
export class ProjectController {
  private repository = new DrizzleProjectRepository();

  /**
   * GET /api/projects
   * Get all projects
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllProjectsUseCase(this.repository);

      const options = {
        featured: req.query.featured === 'true' ? true : undefined,
        category: req.query.category as string | undefined,
        status: req.query.status as string | undefined,
        orderBy: (req.query.orderBy as 'createdAt' | 'order' | 'startDate') || 'order',
        orderDirection: (req.query.orderDirection as 'asc' | 'desc') || 'asc',
      };

      const projects = await useCase.execute(options);

      res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/:id
   * Get project by ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const useCase = new GetProjectByIdUseCase(this.repository);

      const project = await useCase.execute(id);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/slug/:slug
   * Get project by slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const useCase = new GetProjectBySlugUseCase(this.repository);

      const project = await useCase.execute(slug);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/projects
   * Create new project (admin only)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateProjectSchema.parse(req.body);
      const useCase = new CreateProjectUseCase(this.repository);

      // Convert date strings to Date objects
      const inputData = {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      };

      const project = await useCase.execute(inputData);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/projects/:id
   * Update project (admin only)
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const validatedData = UpdateProjectSchema.parse(req.body);
      const useCase = new UpdateProjectUseCase(this.repository);

      // Convert date strings to Date objects
      const inputData = {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      };

      const project = await useCase.execute({ id, ...inputData });

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/projects/:id
   * Delete project (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const useCase = new DeleteProjectUseCase(this.repository);

      await useCase.execute(id);

      res.json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
