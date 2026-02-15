import bcrypt from 'bcrypt';
import logger from '../../shared/utils/logger.js';
import { prisma } from '../persistence/prismaClient.js';
import { IAdminUserRepository } from '../../domain/interfaces/IAdminUserRepository.js';
import {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  SafeAdminUser,
} from '../../domain/entities/AdminUser.js';

const SALT_ROUNDS = 12;

/**
 * Prisma implementation of AdminUser Repository
 */
export class PrismaAdminUserRepository implements IAdminUserRepository {
  /**
   * Remove sensitive data from admin user object
   */
  private toSafeUser(user: AdminUser): SafeAdminUser {
    // Destructure and omit hashedPassword to avoid linter warning about unused variable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...safeUser } = user;
    return safeUser;
  }

  async findAll(options?: { active?: boolean }): Promise<SafeAdminUser[]> {
    const where = options?.active !== undefined ? { active: options.active } : undefined;

    const users = await prisma.adminUser.findMany({
      where,
      orderBy: { username: 'asc' },
    });

    return users.map((user) => this.toSafeUser(user));
  }

  async findById(id: number): Promise<AdminUser | null> {
    return await prisma.adminUser.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<AdminUser | null> {
    return await prisma.adminUser.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    return await prisma.adminUser.findUnique({
      where: { email },
    });
  }

  async create(data: CreateAdminUserInput): Promise<SafeAdminUser> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.adminUser.create({
      data: {
        username: data.username,
        email: data.email,
        hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        active: data.active ?? true,
      },
    });

    return this.toSafeUser(user);
  }

  async update(data: UpdateAdminUserInput): Promise<SafeAdminUser | null> {
    const { id, password, ...updateData } = data;

    const dataToUpdate: Partial<Omit<UpdateAdminUserInput, 'id' | 'password'>> & {
      hashedPassword?: string;
    } = { ...updateData };

    if (password) {
      dataToUpdate.hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    try {
      const user = await prisma.adminUser.update({
        where: { id },
        data: dataToUpdate,
      });
      return this.toSafeUser(user);
    } catch (error) {
      // INSERT_YOUR_CODE
      // Import logger at the top of your file: import logger from '../../shared/utils/logger.js';
      logger.error('Error updating admin user:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.adminUser.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error deleting admin user:', error);
      return false;
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    await prisma.adminUser.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async count(options?: { active?: boolean }): Promise<number> {
    const where = options?.active !== undefined ? { active: options.active } : undefined;
    return await prisma.adminUser.count({ where });
  }
}
