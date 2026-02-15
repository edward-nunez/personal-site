import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../shared/errors/index.js';
import config from '../../../configs/index.js';

export interface TokenPayload {
  id: number;
  username: string;
  email: string;
}

/**
 * Use case: Validate JWT token
 * Verifies and decodes JWT token
 */
export class ValidateTokenUseCase {
  execute(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid or expired token');
      }

      throw new UnauthorizedError('Validation error');
    }
  }
}
