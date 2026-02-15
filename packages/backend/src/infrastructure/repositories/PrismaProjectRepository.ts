import { prisma } from '../persistence/prismaClient.js';
import { IProjectRepository } from '../../domain/interfaces/IProjectRepository.js';
import { Project, CreateProjectInput, UpdateProjectInput } from '../../domain/entities/Project.js';
import logger from '../../shared/utils/logger.js';

/**
 * Prisma implementation of Project Repository
 */
export class PrismaProjectRepository implements IProjectRepository {
  async findAll(options?: {
    featured?: boolean;
    category?: string;
    status?: string;
    orderBy?: 'createdAt' | 'order' | 'startDate';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Project[]> {
    const where: { featured?: boolean; category?: string; status?: string } = {};
    if (options?.featured !== undefined) where.featured = options.featured;
    if (options?.category) where.category = options.category;
    if (options?.status) where.status = options.status;

    const orderByField = options?.orderBy || 'order';
    const orderDirection = options?.orderDirection || 'asc';

    return await prisma.project.findMany({
      where,
      orderBy: { [orderByField]: orderDirection },
    });
  }

  async findById(id: number): Promise<Project | null> {
    return await prisma.project.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return await prisma.project.findUnique({
      where: { slug },
    });
  }

  async findByCategory(category: string): Promise<Project[]> {
    return await prisma.project.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    });
  }

  async findByTechnology(technology: string): Promise<Project[]> {
    return await prisma.project.findMany({
      where: {
        technologies: { has: technology },
      },
      orderBy: { order: 'asc' },
    });
  }

  async search(keyword: string): Promise<Project[]> {
    const lowerKeyword = keyword.toLowerCase();

    return await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: lowerKeyword, mode: 'insensitive' } },
          { description: { contains: lowerKeyword, mode: 'insensitive' } },
          { shortDescription: { contains: lowerKeyword, mode: 'insensitive' } },
          { technologies: { has: keyword } },
          { tags: { has: keyword } },
        ],
      },
      orderBy: { order: 'asc' },
    });
  }

  async create(data: CreateProjectInput): Promise<Project> {
    return await prisma.project.create({
      data: {
        ...data,
        technologies: data.technologies || [],
        tags: data.tags || [],
        images: data.images || [],
        featured: data.featured ?? false,
        status: data.status || 'completed',
        order: data.order ?? 0,
      },
    });
  }

  async update(data: UpdateProjectInput): Promise<Project | null> {
    const { id, ...updateData } = data;

    try {
      return await prisma.project.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      logger.error('Error updating project:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.project.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error deleting project:', error);
      return false;
    }
  }

  async getCategories(): Promise<string[]> {
    const projects = await prisma.project.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return projects.map((p) => p.category);
  }

  async count(options?: { category?: string; status?: string }): Promise<number> {
    const where: { category?: string; status?: string } = {};
    if (options?.category) where.category = options.category;
    if (options?.status) where.status = options.status;

    return await prisma.project.count({ where });
  }
}
