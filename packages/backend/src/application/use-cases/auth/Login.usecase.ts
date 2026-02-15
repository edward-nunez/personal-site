import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAdminUserRepository } from '../../../domain/interfaces/IAdminUserRepository.js';
import { UnauthorizedError } from '../../../shared/errors/index.js';
import config from '../../../configs/index.js';

export interface LoginResult {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

/**
 * Use case: Admin user login
 * Verifies credentials and generates JWT token
 */
export class LoginUseCase {
  constructor(private adminUserRepository: IAdminUserRepository) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    // Find user by username
    const user = await this.adminUserRepository.findByUsername(username);

    if (!user || !user.active) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await this.adminUserRepository.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
