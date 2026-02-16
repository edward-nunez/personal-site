import { eq, and, or, ilike, arrayContains, count as drizzleCount, asc, desc } from 'drizzle-orm';
import { db } from '../persistence/db.js';
import { projects } from '../persistence/schema.js';
import { IProjectRepository } from '../../domain/interfaces/IProjectRepository.js';
import { Project, CreateProjectInput, UpdateProjectInput } from '../../domain/entities/Project.js';
import logger from '../../shared/utils/logger.js';

/**
 * Drizzle implementation of Project Repository
 */
export class DrizzleProjectRepository implements IProjectRepository {
  async findAll(options?: {
    featured?: boolean;
    category?: string;
    status?: string;
    orderBy?: 'createdAt' | 'order' | 'startDate';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Project[]> {
    const conditions = [];
    if (options?.featured !== undefined) conditions.push(eq(projects.featured, options.featured));
    if (options?.category) conditions.push(eq(projects.category, options.category));
    if (options?.status) conditions.push(eq(projects.status, options.status));

    const orderByField = options?.orderBy || 'order';
    const orderDirection = options?.orderDirection || 'asc';
    const colMap = {
      createdAt: projects.createdAt,
      order: projects.order,
      startDate: projects.startDate,
    } as const;
    const col = colMap[orderByField];
    const orderFn = orderDirection === 'asc' ? asc(col) : desc(col);

    return await db
      .select()
      .from(projects)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderFn);
  }

  async findById(id: string): Promise<Project | null> {
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return rows[0] ?? null;
  }

  async findByCategory(category: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.category, category))
      .orderBy(asc(projects.order));
  }

  async findByTechnology(technology: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(arrayContains(projects.technologies, [technology]))
      .orderBy(asc(projects.order));
  }

  async search(keyword: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(
        or(
          ilike(projects.title, `%${keyword}%`),
          ilike(projects.description, `%${keyword}%`),
          ilike(projects.shortDescription, `%${keyword}%`),
          arrayContains(projects.technologies, [keyword]),
          arrayContains(projects.tags, [keyword])
        )
      )
      .orderBy(asc(projects.order));
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const rows = await db
      .insert(projects)
      .values({
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription ?? null,
        technologies: data.technologies || [],
        category: data.category,
        tags: data.tags || [],
        githubUrl: data.githubUrl ?? null,
        liveUrl: data.liveUrl ?? null,
        godotWebExport: data.godotWebExport ?? null,
        images: data.images || [],
        featured: data.featured ?? false,
        status: data.status || 'completed',
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        order: data.order ?? 0,
      })
      .returning();
    return rows[0];
  }

  async update(data: UpdateProjectInput): Promise<Project | null> {
    const { id, ...updateData } = data;

    try {
      const rows = await db
        .update(projects)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return rows[0] ?? null;
    } catch (error) {
      logger.error('Error updating project:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning({ id: projects.id });
      return rows.length > 0;
    } catch (error) {
      logger.error('Error deleting project:', error);
      return false;
    }
  }

  async getCategories(): Promise<string[]> {
    const rows = await db.selectDistinct({ category: projects.category }).from(projects);
    return rows.map((r) => r.category);
  }

  async count(options?: { category?: string; status?: string }): Promise<number> {
    const conditions = [];
    if (options?.category) conditions.push(eq(projects.category, options.category));
    if (options?.status) conditions.push(eq(projects.status, options.status));

    const rows = await db
      .select({ value: drizzleCount() })
      .from(projects)
      .where(conditions.length ? and(...conditions) : undefined);
    return rows[0].value;
  }
}
