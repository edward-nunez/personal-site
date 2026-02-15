/**
 * Experience Domain Entity
 * Represents a professional work experience or role
 */
export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string | null;
  achievements: string[];
  skills: string[];
  technologies: string[];
  location?: string | null;
  employmentType?: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating new experience (without auto-generated fields)
 */
export interface CreateExperienceInput {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string | null;
  achievements?: string[];
  skills?: string[];
  technologies?: string[];
  location?: string | null;
  employmentType?: string | null;
  featured?: boolean;
  order?: number;
}

/**
 * DTO for updating experience (all fields optional except id)
 */
export interface UpdateExperienceInput {
  id: number;
  company?: string;
  role?: string;
  startDate?: Date;
  endDate?: Date | null;
  description?: string | null;
  achievements?: string[];
  skills?: string[];
  technologies?: string[];
  location?: string | null;
  employmentType?: string | null;
  featured?: boolean;
  order?: number;
}
