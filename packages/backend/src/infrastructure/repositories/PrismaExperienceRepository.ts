import { prisma } from '../persistence/prismaClient.js';
import { IExperienceRepository } from '../../domain/interfaces/IExperienceRepository.js';
import {
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../../domain/entities/Experience.js';
import logger from '../../shared/utils/logger.js';

/**
 * Prisma implementation of Experience Repository
 * Handles all database operations for Experience entity
 */
export class PrismaExperienceRepository implements IExperienceRepository {
  async findAll(options?: {
    featured?: boolean;
    orderBy?: 'startDate' | 'order';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Experience[]> {
    const orderByField = options?.orderBy || 'startDate';
    const orderDirection = options?.orderDirection || 'desc';

    return await prisma.experience.findMany({
      where: options?.featured !== undefined ? { featured: options.featured } : undefined,
      orderBy: { [orderByField]: orderDirection },
    });
  }

  async findById(id: number): Promise<Experience | null> {
    return await prisma.experience.findUnique({
      where: { id },
    });
  }

  async findByTechnology(technology: string): Promise<Experience[]> {
    return await prisma.experience.findMany({
      where: {
        OR: [{ technologies: { has: technology } }, { skills: { has: technology } }],
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async create(data: CreateExperienceInput): Promise<Experience> {
    return await prisma.experience.create({
      data: {
        ...data,
        achievements: data.achievements || [],
        skills: data.skills || [],
        technologies: data.technologies || [],
        featured: data.featured ?? false,
        order: data.order ?? 0,
      },
    });
  }

  async update(data: UpdateExperienceInput): Promise<Experience | null> {
    const { id, ...updateData } = data;

    try {
      return await prisma.experience.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      logger.error('Error updating experience:', error);
      return null; // Record not found
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.experience.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error deleting experience:', error);
      return false; // Record not found
    }
  }

  async count(): Promise<number> {
    return await prisma.experience.count();
  }
}
