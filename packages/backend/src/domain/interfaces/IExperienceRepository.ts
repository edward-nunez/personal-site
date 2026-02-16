import {
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../entities/Experience.js';

/**
 * Experience Repository Interface
 * Defines contract for Experience data access operations
 * Following Repository pattern and Dependency Inversion Principle
 */
export interface IExperienceRepository {
  /**
   * Find all experiences
   * @param options Optional filtering/sorting options
   */
  findAll(options?: {
    featured?: boolean;
    orderBy?: 'startDate' | 'order';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Experience[]>;

  /**
   * Find experience by ID
   * @param id Experience ID
   * @returns Experience or null if not found
   */
  findById(id: string): Promise<Experience | null>;

  /**
   * Find experiences by technology/skill
   * @param technology Technology or skill name
   */
  findByTechnology(technology: string): Promise<Experience[]>;

  /**
   * Create new experience
   * @param data Experience creation data
   * @returns Created experience
   */
  create(data: CreateExperienceInput): Promise<Experience>;

  /**
   * Update existing experience
   * @param data Experience update data
   * @returns Updated experience or null if not found
   */
  update(data: UpdateExperienceInput): Promise<Experience | null>;

  /**
   * Delete experience by ID
   * @param id Experience ID
   * @returns True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count total experiences
   */
  count(): Promise<number>;
}
