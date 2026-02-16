import { Request, Response, NextFunction } from 'express';
import { ValidateTokenUseCase } from '../../application/use-cases/auth/index.js';
import { UnauthorizedError } from '../../shared/errors/index.js';

// Extend Express Request to include user
export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token
    const validateTokenUseCase = new ValidateTokenUseCase();
    const decoded = validateTokenUseCase.execute(token);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
