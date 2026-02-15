/**
 * Project Domain Entity
 * Represents a portfolio project or work sample
 */
export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  technologies: string[];
  category: string;
  tags: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  godotWebExport?: string | null;
  images: string[];
  featured: boolean;
  status: string;
  startDate?: Date | null;
  endDate?: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating new project
 */
export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  technologies?: string[];
  category: string;
  tags?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  godotWebExport?: string | null;
  images?: string[];
  featured?: boolean;
  status?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  order?: number;
}

/**
 * DTO for updating project
 */
export interface UpdateProjectInput {
  id: number;
  title?: string;
  slug?: string;
  description?: string;
  shortDescription?: string | null;
  technologies?: string[];
  category?: string;
  tags?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  godotWebExport?: string | null;
  images?: string[];
  featured?: boolean;
  status?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  order?: number;
}
