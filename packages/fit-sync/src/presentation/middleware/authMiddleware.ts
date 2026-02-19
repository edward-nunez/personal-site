import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../shared/errors/AppError.js';
import { verifyToken, extractBearerToken } from '../../shared/utils/auth.js';
import { logger } from '../../shared/utils/logger.js';

export interface AuthRequest extends Request {
  user?: { id: string; username?: string; email?: string };
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      logger.warn('Missing authorization token');
      throw new UnauthorizedError('Missing Authorization header with Bearer token');
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      logger.warn('Token verification failed', { error });
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
}
