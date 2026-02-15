import { prisma } from '../persistence/prismaClient.js';
import { IContactSubmissionRepository } from '../../domain/interfaces/IContactSubmissionRepository.js';
import {
  ContactSubmission,
  CreateContactSubmissionInput,
  UpdateContactSubmissionInput,
} from '../../domain/entities/ContactSubmission.js';
import logger from '../../shared/utils/logger.js';

/**
 * Prisma implementation of ContactSubmission Repository
 */
export class PrismaContactSubmissionRepository implements IContactSubmissionRepository {
  async findAll(options?: {
    read?: boolean;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ContactSubmission[]> {
    const where = options?.read !== undefined ? { read: options.read } : undefined;
    const orderDirection = options?.orderDirection || 'desc';

    return await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: orderDirection },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async findById(id: number): Promise<ContactSubmission | null> {
    return await prisma.contactSubmission.findUnique({
      where: { id },
    });
  }

  async create(data: CreateContactSubmissionInput): Promise<ContactSubmission> {
    return await prisma.contactSubmission.create({
      data,
    });
  }

  async update(data: UpdateContactSubmissionInput): Promise<ContactSubmission | null> {
    const { id, ...updateData } = data;

    try {
      return await prisma.contactSubmission.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      logger.error('Error updating contact submission:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.contactSubmission.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error deleting contact submission:', error);
      return false;
    }
  }

  async count(options?: { read?: boolean }): Promise<number> {
    const where = options?.read !== undefined ? { read: options.read } : undefined;
    return await prisma.contactSubmission.count({ where });
  }

  async getUnreadCount(): Promise<number> {
    return await prisma.contactSubmission.count({
      where: { read: false },
    });
  }
}
