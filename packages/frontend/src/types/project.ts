/**
 * Project types aligned with backend entity and DTOs.
 * API response/request shapes; display-only fields on ProjectDisplay.
 */

import type { ProjectContentBlock } from './content';

/** Backend project status enum */
export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

/** Project as returned from API (matches backend entity) */
export interface Project {
  id: string;
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
  status: ProjectStatus;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Display type for UI: extends API shape with optional frontend-only fields
 * (chapter, role, duration, highlights, content blocks).
 * coverImage can be derived as images[0] when using API data.
 */
export interface ProjectDisplay extends Project {
  /** Optional for static data; derive from images[0] when from API */
  coverImage?: string;
  chapter?: string;
  role?: string;
  duration?: string;
  highlights?: string[];
  content?: ProjectContentBlock[];
}
