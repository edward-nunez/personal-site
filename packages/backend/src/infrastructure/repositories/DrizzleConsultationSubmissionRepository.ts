import { eq, and, count as drizzleCount, asc, desc } from 'drizzle-orm';
import { db } from '../persistence/db.js';
import { consultationSubmissions } from '../persistence/schema.js';
import { IConsultationSubmissionRepository } from '../../domain/interfaces/IConsultationSubmissionRepository.js';
import {
  ConsultationSubmission,
  CreateConsultationSubmissionInput,
  UpdateConsultationSubmissionInput,
} from '../../domain/entities/ConsultationSubmission.js';
import logger from '../../shared/utils/logger.js';

/**
 * Drizzle implementation of ConsultationSubmission Repository
 */
export class DrizzleConsultationSubmissionRepository implements IConsultationSubmissionRepository {
  async findAll(options?: {
    read?: boolean;
    serviceType?: string;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ConsultationSubmission[]> {
    const conditions = [];
    if (options?.read !== undefined)
      conditions.push(eq(consultationSubmissions.read, options.read));
    if (options?.serviceType)
      conditions.push(eq(consultationSubmissions.serviceType, options.serviceType));

    const orderDirection = options?.orderDirection || 'desc';
    const orderFn =
      orderDirection === 'asc'
        ? asc(consultationSubmissions.createdAt)
        : desc(consultationSubmissions.createdAt);

    let query = db
      .select()
      .from(consultationSubmissions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderFn)
      .$dynamic();

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.offset(options.offset);

    return await query;
  }

  async findById(id: string): Promise<ConsultationSubmission | null> {
    const rows = await db
      .select()
      .from(consultationSubmissions)
      .where(eq(consultationSubmissions.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: CreateConsultationSubmissionInput): Promise<ConsultationSubmission> {
    const rows = await db
      .insert(consultationSubmissions)
      .values({
        name: data.name,
        email: data.email,
        company: data.company ?? null,
        serviceType: data.serviceType,
        budget: data.budget ?? null,
        timeline: data.timeline ?? null,
        description: data.description,
      })
      .returning();
    return rows[0];
  }

  async update(data: UpdateConsultationSubmissionInput): Promise<ConsultationSubmission | null> {
    const { id, ...updateData } = data;

    try {
      const rows = await db
        .update(consultationSubmissions)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(consultationSubmissions.id, id))
        .returning();
      return rows[0] ?? null;
    } catch (error) {
      logger.error('Error updating consultation submission:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await db
        .delete(consultationSubmissions)
        .where(eq(consultationSubmissions.id, id))
        .returning({ id: consultationSubmissions.id });
      return rows.length > 0;
    } catch (error) {
      logger.error('Error deleting consultation submission:', error);
      return false;
    }
  }

  async count(options?: { read?: boolean; serviceType?: string }): Promise<number> {
    const conditions = [];
    if (options?.read !== undefined)
      conditions.push(eq(consultationSubmissions.read, options.read));
    if (options?.serviceType)
      conditions.push(eq(consultationSubmissions.serviceType, options.serviceType));

    const rows = await db
      .select({ value: drizzleCount() })
      .from(consultationSubmissions)
      .where(conditions.length ? and(...conditions) : undefined);
    return rows[0].value;
  }

  async getUnreadCount(): Promise<number> {
    const rows = await db
      .select({ value: drizzleCount() })
      .from(consultationSubmissions)
      .where(eq(consultationSubmissions.read, false));
    return rows[0].value;
  }

  async getServiceTypes(): Promise<string[]> {
    const rows = await db
      .selectDistinct({ serviceType: consultationSubmissions.serviceType })
      .from(consultationSubmissions);
    return rows.map((r) => r.serviceType);
  }
}
