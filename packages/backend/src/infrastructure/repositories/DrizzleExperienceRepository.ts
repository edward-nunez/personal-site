import { eq, and, or, arrayContains, count as drizzleCount, asc, desc } from 'drizzle-orm';
import { db } from '../persistence/db.js';
import { experiences } from '../persistence/schema.js';
import { IExperienceRepository } from '../../domain/interfaces/IExperienceRepository.js';
import {
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../../domain/entities/Experience.js';
import logger from '../../shared/utils/logger.js';

/**
 * Drizzle implementation of Experience Repository
 * Handles all database operations for Experience entity
 */
export class DrizzleExperienceRepository implements IExperienceRepository {
  async findAll(options?: {
    featured?: boolean;
    orderBy?: 'startDate' | 'order';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Experience[]> {
    const orderByField = options?.orderBy || 'startDate';
    const orderDirection = options?.orderDirection || 'desc';
    const col = orderByField === 'order' ? experiences.order : experiences.startDate;
    const orderFn = orderDirection === 'asc' ? asc(col) : desc(col);

    const conditions = [];
    if (options?.featured !== undefined) {
      conditions.push(eq(experiences.featured, options.featured));
    }

    return await db
      .select()
      .from(experiences)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderFn);
  }

  async findById(id: string): Promise<Experience | null> {
    const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findByTechnology(technology: string): Promise<Experience[]> {
    return await db
      .select()
      .from(experiences)
      .where(
        or(
          arrayContains(experiences.technologies, [technology]),
          arrayContains(experiences.skills, [technology])
        )
      )
      .orderBy(desc(experiences.startDate));
  }

  async create(data: CreateExperienceInput): Promise<Experience> {
    const rows = await db
      .insert(experiences)
      .values({
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        description: data.description ?? null,
        achievements: data.achievements || [],
        skills: data.skills || [],
        technologies: data.technologies || [],
        location: data.location ?? null,
        employmentType: data.employmentType ?? null,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      })
      .returning();
    return rows[0];
  }

  async update(data: UpdateExperienceInput): Promise<Experience | null> {
    const { id, ...updateData } = data;

    try {
      const rows = await db
        .update(experiences)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(experiences.id, id))
        .returning();
      return rows[0] ?? null;
    } catch (error) {
      logger.error('Error updating experience:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await db
        .delete(experiences)
        .where(eq(experiences.id, id))
        .returning({ id: experiences.id });
      return rows.length > 0;
    } catch (error) {
      logger.error('Error deleting experience:', error);
      return false;
    }
  }

  async count(): Promise<number> {
    const rows = await db.select({ value: drizzleCount() }).from(experiences);
    return rows[0].value;
  }
}
