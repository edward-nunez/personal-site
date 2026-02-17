import { asc } from 'drizzle-orm';
import { db } from '../persistence/db.js';
import { toolkitCategories } from '../persistence/schema.js';
import type { IToolkitCategoryRepository } from '../../domain/interfaces/IToolkitCategoryRepository.js';
import type { ToolkitCategory } from '../../domain/entities/ToolkitCategory.js';

export class DrizzleToolkitCategoryRepository implements IToolkitCategoryRepository {
  async findAll(): Promise<ToolkitCategory[]> {
    return await db.select().from(toolkitCategories).orderBy(asc(toolkitCategories.order));
  }
}
