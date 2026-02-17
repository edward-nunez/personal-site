/**
 * Experience types aligned with backend entity.
 * period is derived from startDate/endDate in UI (formatPeriod).
 */

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  description?: string | null;
  achievements: string[];
  skills: string[];
  technologies: string[];
  location?: string | null;
  employmentType?: string | null;
  featured: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
