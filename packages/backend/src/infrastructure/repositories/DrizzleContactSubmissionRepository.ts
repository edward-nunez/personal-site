import { eq, and, count as drizzleCount, asc, desc } from 'drizzle-orm';
import { db } from '../persistence/db.js';
import { contactSubmissions } from '../persistence/schema.js';
import { IContactSubmissionRepository } from '../../domain/interfaces/IContactSubmissionRepository.js';
import {
  ContactSubmission,
  CreateContactSubmissionInput,
  UpdateContactSubmissionInput,
} from '../../domain/entities/ContactSubmission.js';
import logger from '../../shared/utils/logger.js';

/**
 * Drizzle implementation of ContactSubmission Repository
 */
export class DrizzleContactSubmissionRepository implements IContactSubmissionRepository {
  async findAll(options?: {
    read?: boolean;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ContactSubmission[]> {
    const conditions = [];
    if (options?.read !== undefined) conditions.push(eq(contactSubmissions.read, options.read));

    const orderDirection = options?.orderDirection || 'desc';
    const orderFn =
      orderDirection === 'asc'
        ? asc(contactSubmissions.createdAt)
        : desc(contactSubmissions.createdAt);

    let query = db
      .select()
      .from(contactSubmissions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderFn)
      .$dynamic();

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.offset(options.offset);

    return await query;
  }

  async findById(id: string): Promise<ContactSubmission | null> {
    const rows = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: CreateContactSubmissionInput): Promise<ContactSubmission> {
    const rows = await db
      .insert(contactSubmissions)
      .values({
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
      })
      .returning();
    return rows[0];
  }

  async update(data: UpdateContactSubmissionInput): Promise<ContactSubmission | null> {
    const { id, ...updateData } = data;

    try {
      const rows = await db
        .update(contactSubmissions)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(contactSubmissions.id, id))
        .returning();
      return rows[0] ?? null;
    } catch (error) {
      logger.error('Error updating contact submission:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await db
        .delete(contactSubmissions)
        .where(eq(contactSubmissions.id, id))
        .returning({ id: contactSubmissions.id });
      return rows.length > 0;
    } catch (error) {
      logger.error('Error deleting contact submission:', error);
      return false;
    }
  }

  async count(options?: { read?: boolean }): Promise<number> {
    const conditions = [];
    if (options?.read !== undefined) conditions.push(eq(contactSubmissions.read, options.read));

    const rows = await db
      .select({ value: drizzleCount() })
      .from(contactSubmissions)
      .where(conditions.length ? and(...conditions) : undefined);
    return rows[0].value;
  }

  async getUnreadCount(): Promise<number> {
    const rows = await db
      .select({ value: drizzleCount() })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.read, false));
    return rows[0].value;
  }
}
