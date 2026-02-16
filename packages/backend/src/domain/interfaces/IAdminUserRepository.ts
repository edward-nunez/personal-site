import {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  SafeAdminUser,
} from '../entities/AdminUser.js';

/**
 * AdminUser Repository Interface
 * Defines contract for AdminUser data access operations
 */
export interface IAdminUserRepository {
  /**
   * Find all admin users
   * @param options Optional filtering options
   */
  findAll(options?: { active?: boolean }): Promise<SafeAdminUser[]>;

  /**
   * Find admin user by ID
   * @param id Admin user ID
   */
  findById(id: string): Promise<AdminUser | null>;

  /**
   * Find admin user by username
   * @param username Username
   */
  findByUsername(username: string): Promise<AdminUser | null>;

  /**
   * Find admin user by email
   * @param email Email address
   */
  findByEmail(email: string): Promise<AdminUser | null>;

  /**
   * Create new admin user
   * @param data Admin user creation data
   */
  create(data: CreateAdminUserInput): Promise<SafeAdminUser>;

  /**
   * Update existing admin user
   * @param data Admin user update data
   */
  update(data: UpdateAdminUserInput): Promise<SafeAdminUser | null>;

  /**
   * Delete admin user by ID
   * @param id Admin user ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Update last login timestamp
   * @param id Admin user ID
   */
  updateLastLogin(id: string): Promise<void>;

  /**
   * Count total admin users
   */
  count(options?: { active?: boolean }): Promise<number>;
}
