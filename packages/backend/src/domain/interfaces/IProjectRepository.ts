import { Project, CreateProjectInput, UpdateProjectInput } from '../entities/Project.js';

/**
 * Project Repository Interface
 * Defines contract for Project data access operations
 */
export interface IProjectRepository {
  /**
   * Find all projects
   * @param options Optional filtering/sorting options
   */
  findAll(options?: {
    featured?: boolean;
    category?: string;
    status?: string;
    orderBy?: 'createdAt' | 'order' | 'startDate';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Project[]>;

  /**
   * Find project by ID
   * @param id Project ID
   */
  findById(id: string): Promise<Project | null>;

  /**
   * Find project by slug
   * @param slug Project slug
   */
  findBySlug(slug: string): Promise<Project | null>;

  /**
   * Find projects by category
   * @param category Project category
   */
  findByCategory(category: string): Promise<Project[]>;

  /**
   * Find projects by technology
   * @param technology Technology name
   */
  findByTechnology(technology: string): Promise<Project[]>;

  /**
   * Search projects by keyword
   * @param keyword Search keyword
   */
  search(keyword: string): Promise<Project[]>;

  /**
   * Create new project
   * @param data Project creation data
   */
  create(data: CreateProjectInput): Promise<Project>;

  /**
   * Update existing project
   * @param data Project update data
   */
  update(data: UpdateProjectInput): Promise<Project | null>;

  /**
   * Delete project by ID
   * @param id Project ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get all unique categories
   */
  getCategories(): Promise<string[]>;

  /**
   * Count total projects
   */
  count(options?: { category?: string; status?: string }): Promise<number>;
}
