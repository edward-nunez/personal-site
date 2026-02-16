import { Request, Response, NextFunction } from 'express';
import { DrizzleAdminUserRepository } from '../../infrastructure/repositories/DrizzleAdminUserRepository.js';
import { LoginUseCase } from '../../application/use-cases/auth/index.js';
import { LoginSchema } from '../../application/dtos/auth.dto.js';

/**
 * Auth Controller
 * Handles authentication and authorization
 */
export class AuthController {
  private repository = new DrizzleAdminUserRepository();

  /**
   * POST /api/auth/login
   * Admin login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = LoginSchema.parse(req.body ?? {});
      const useCase = new LoginUseCase(this.repository);

      const result = await useCase.execute(username, password);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current user info (requires authentication)
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
