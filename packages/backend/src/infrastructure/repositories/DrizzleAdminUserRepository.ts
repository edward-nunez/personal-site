import bcrypt from 'bcrypt';
import { eq, and, count as drizzleCount, asc } from 'drizzle-orm';
import logger from '../../shared/utils/logger.js';
import { db } from '../persistence/db.js';
import { adminUsers } from '../persistence/schema.js';
import { IAdminUserRepository } from '../../domain/interfaces/IAdminUserRepository.js';
import {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  SafeAdminUser,
} from '../../domain/entities/AdminUser.js';

const SALT_ROUNDS = 12;

/**
 * Drizzle implementation of AdminUser Repository
 */
export class DrizzleAdminUserRepository implements IAdminUserRepository {
  /**
   * Remove sensitive data from admin user object
   */
  private toSafeUser(user: AdminUser): SafeAdminUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...safeUser } = user;
    return safeUser;
  }

  async findAll(options?: { active?: boolean }): Promise<SafeAdminUser[]> {
    const conditions = [];
    if (options?.active !== undefined) {
      conditions.push(eq(adminUsers.active, options.active));
    }

    const users = await db
      .select()
      .from(adminUsers)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(adminUsers.username));

    return users.map((user) => this.toSafeUser(user));
  }

  async findById(id: string): Promise<AdminUser | null> {
    const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findByUsername(username: string): Promise<AdminUser | null> {
    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);
    return rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return rows[0] ?? null;
  }

  async create(data: CreateAdminUserInput): Promise<SafeAdminUser> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const rows = await db
      .insert(adminUsers)
      .values({
        username: data.username,
        email: data.email,
        hashedPassword,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        active: data.active ?? true,
      })
      .returning();

    return this.toSafeUser(rows[0]);
  }

  async update(data: UpdateAdminUserInput): Promise<SafeAdminUser | null> {
    const { id, password, ...updateData } = data;

    const dataToUpdate: Record<string, unknown> = { ...updateData, updatedAt: new Date() };

    if (password) {
      dataToUpdate.hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    try {
      const rows = await db
        .update(adminUsers)
        .set(dataToUpdate)
        .where(eq(adminUsers.id, id))
        .returning();
      if (rows.length === 0) return null;
      return this.toSafeUser(rows[0]);
    } catch (error) {
      logger.error('Error updating admin user:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await db
        .delete(adminUsers)
        .where(eq(adminUsers.id, id))
        .returning({ id: adminUsers.id });
      return rows.length > 0;
    } catch (error) {
      logger.error('Error deleting admin user:', error);
      return false;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(adminUsers.id, id));
  }

  async count(options?: { active?: boolean }): Promise<number> {
    const conditions = [];
    if (options?.active !== undefined) {
      conditions.push(eq(adminUsers.active, options.active));
    }

    const rows = await db
      .select({ value: drizzleCount() })
      .from(adminUsers)
      .where(conditions.length ? and(...conditions) : undefined);
    return rows[0].value;
  }
}
