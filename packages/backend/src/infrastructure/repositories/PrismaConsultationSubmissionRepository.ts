import { prisma } from '../persistence/prismaClient.js';
import { IConsultationSubmissionRepository } from '../../domain/interfaces/IConsultationSubmissionRepository.js';
import {
  ConsultationSubmission,
  CreateConsultationSubmissionInput,
  UpdateConsultationSubmissionInput,
} from '../../domain/entities/ConsultationSubmission.js';
import logger from '../../shared/utils/logger.js';

/**
 * Prisma implementation of ConsultationSubmission Repository
 */
export class PrismaConsultationSubmissionRepository implements IConsultationSubmissionRepository {
  async findAll(options?: {
    read?: boolean;
    serviceType?: string;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ConsultationSubmission[]> {
    const where: { read?: boolean; serviceType?: string } = {};
    if (options?.read !== undefined) where.read = options.read;
    if (options?.serviceType) where.serviceType = options.serviceType;

    const orderDirection = options?.orderDirection || 'desc';

    return await prisma.consultationSubmission.findMany({
      where,
      orderBy: { createdAt: orderDirection },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async findById(id: number): Promise<ConsultationSubmission | null> {
    return await prisma.consultationSubmission.findUnique({
      where: { id },
    });
  }

  async create(data: CreateConsultationSubmissionInput): Promise<ConsultationSubmission> {
    return await prisma.consultationSubmission.create({
      data,
    });
  }

  async update(data: UpdateConsultationSubmissionInput): Promise<ConsultationSubmission | null> {
    const { id, ...updateData } = data;

    try {
      return await prisma.consultationSubmission.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      logger.error('Error updating consultation submission:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.consultationSubmission.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error deleting consultation submission:', error);
      return false;
    }
  }

  async count(options?: { read?: boolean; serviceType?: string }): Promise<number> {
    const where: { read?: boolean; serviceType?: string } = {};
    if (options?.read !== undefined) where.read = options.read;
    if (options?.serviceType) where.serviceType = options.serviceType;

    return await prisma.consultationSubmission.count({ where });
  }

  async getUnreadCount(): Promise<number> {
    return await prisma.consultationSubmission.count({
      where: { read: false },
    });
  }

  async getServiceTypes(): Promise<string[]> {
    const submissions = await prisma.consultationSubmission.findMany({
      select: { serviceType: true },
      distinct: ['serviceType'],
    });
    return submissions.map((s) => s.serviceType);
  }
}
