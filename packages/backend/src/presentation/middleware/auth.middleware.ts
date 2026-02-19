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
    // Extract JWT from Authorization header. Bearer scheme is HTTP standard for token-based auth.
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);

    // Validate JWT signature and expiration. Invalid/expired tokens reject request at security boundary.
    const validateTokenUseCase = new ValidateTokenUseCase();
    const decoded = validateTokenUseCase.execute(token);

    // Attach decoded payload to request for downstream route handlers. Enables role-based access control.
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
