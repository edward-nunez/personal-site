/**
 * AdminUser Domain Entity
 * Represents an administrative user with access to the backend
 */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  hashedPassword: string;
  firstName?: string | null;
  lastName?: string | null;
  active: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating new admin user
 */
export interface CreateAdminUserInput {
  username: string;
  email: string;
  password: string; // Plain text - will be hashed
  firstName?: string | null;
  lastName?: string | null;
  active?: boolean;
}

/**
 * DTO for updating admin user
 */
export interface UpdateAdminUserInput {
  id: number;
  username?: string;
  email?: string;
  password?: string; // Plain text - will be hashed
  firstName?: string | null;
  lastName?: string | null;
  active?: boolean;
}

/**
 * Admin user without sensitive data (for responses)
 */
export interface SafeAdminUser {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  active: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
