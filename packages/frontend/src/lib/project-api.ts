import type { Project, ProjectDisplay, ProjectStatus } from '@/types';
import { apiGet } from './api';
import { formatChapter } from '@/utils/formatters';

const PROJECTS_BASE = '/projects';

export type ProjectListOptions = {
  featured?: boolean;
  category?: string;
  status?: string;
  orderBy?: 'createdAt' | 'order' | 'startDate';
  orderDirection?: 'asc' | 'desc';
};

/**
 * Fetch all projects from the API.
 */
export async function fetchProjects(options: ProjectListOptions = {}): Promise<Project[]> {
  const params = new URLSearchParams();
  if (options.featured !== undefined) params.set('featured', String(options.featured));
  if (options.category) params.set('category', options.category);
  if (options.status) params.set('status', options.status);
  if (options.orderBy) params.set('orderBy', options.orderBy);
  if (options.orderDirection) params.set('orderDirection', options.orderDirection);
  const query = params.toString();
  const path = query ? `${PROJECTS_BASE}?${query}` : PROJECTS_BASE;
  return apiGet<Project[]>(path);
}

/**
 * Fetch a single project by slug.
 */
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await apiGet<Project>(`${PROJECTS_BASE}/slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

/**
 * Convert API Project to ProjectDisplay.
 * Backend has no role, duration, highlights, content — we derive coverImage from images[0],
 * optional chapter from index, and use description as single paragraph when no content.
 */
export function apiProjectToDisplay(project: Project, index?: number): ProjectDisplay {
  const status = project.status as ProjectStatus;
  const display: ProjectDisplay = {
    ...project,
    status: status ?? 'completed',
    coverImage: project.images[0] ?? undefined,
    chapter: index !== undefined ? formatChapter(index) : undefined,
    role: undefined,
    duration: undefined,
    highlights: undefined,
    // When backend has no content blocks, show description as one paragraph so detail page has body
    content: project.description?.trim()
      ? [{ type: 'paragraph', text: project.description }]
      : undefined,
  };
  return display;
}
