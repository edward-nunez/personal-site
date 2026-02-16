import { Request, Response, NextFunction } from 'express';
import { DrizzleContactSubmissionRepository } from '../../infrastructure/repositories/DrizzleContactSubmissionRepository.js';
import {
  GetAllContactSubmissionsUseCase,
  GetContactSubmissionByIdUseCase,
  CreateContactSubmissionUseCase,
  MarkContactAsReadUseCase,
} from '../../application/use-cases/contact/index.js';
import { CreateContactSubmissionSchema } from '../../application/dtos/submission.dto.js';

/**
 * ContactSubmission Controller
 * Handles HTTP requests for ContactSubmission resources
 */
export class ContactController {
  private repository = new DrizzleContactSubmissionRepository();

  /**
   * GET /api/contact
   * Get all contact submissions (admin only)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllContactSubmissionsUseCase(this.repository);

      const options = {
        read: req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined,
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
   * GET /api/contact/:id
   * Get contact submission by ID (admin only)
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const useCase = new GetContactSubmissionByIdUseCase(this.repository);

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
   * POST /api/contact
   * Create new contact submission (public, rate limited)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateContactSubmissionSchema.parse(req.body);
      const useCase = new CreateContactSubmissionUseCase(this.repository);

      const submission = await useCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: submission,
        message: 'Contact submission received successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/contact/:id/read
   * Mark contact submission as read (admin only)
   */
  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const notes = req.body.notes as string | undefined;
      const useCase = new MarkContactAsReadUseCase(this.repository);

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
   * DELETE /api/contact/:id
   * Delete contact submission (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const deleted = await this.repository.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Contact submission not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Contact submission deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
