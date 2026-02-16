import { Request, Response, NextFunction } from 'express';
import { DrizzleConsultationSubmissionRepository } from '../../infrastructure/repositories/DrizzleConsultationSubmissionRepository.js';
import {
  GetAllConsultationSubmissionsUseCase,
  GetConsultationSubmissionByIdUseCase,
  CreateConsultationSubmissionUseCase,
  MarkConsultationAsReadUseCase,
} from '../../application/use-cases/consultation/index.js';
import { CreateConsultationSubmissionSchema } from '../../application/dtos/submission.dto.js';

/**
 * ConsultationSubmission Controller
 * Handles HTTP requests for ConsultationSubmission resources
 */
export class ConsultationController {
  private repository = new DrizzleConsultationSubmissionRepository();

  /**
   * GET /api/consultation
   * Get all consultation submissions (admin only)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllConsultationSubmissionsUseCase(this.repository);

      const options = {
        read: req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined,
        serviceType: req.query.serviceType as string | undefined,
        orderBy: 'createdAt' as const,
        orderDirection: (req.query.orderDirection as 'asc' | 'desc') || 'desc',
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const submissions = await useCase.execute(options);

      res.json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/consultation/:id
   * Get consultation submission by ID (admin only)
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const useCase = new GetConsultationSubmissionByIdUseCase(this.repository);

      const submission = await useCase.execute(id);

      res.json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/consultation
   * Create new consultation submission (public, rate limited)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateConsultationSubmissionSchema.parse(req.body);
      const useCase = new CreateConsultationSubmissionUseCase(this.repository);

      const submission = await useCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: submission,
        message: 'Consultation request received successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/consultation/:id/read
   * Mark consultation submission as read (admin only)
   */
  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const notes = req.body.notes as string | undefined;
      const useCase = new MarkConsultationAsReadUseCase(this.repository);

      const submission = await useCase.execute(id, notes);

      res.json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/consultation/:id
   * Delete consultation submission (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const deleted = await this.repository.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Consultation submission not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Consultation submission deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
