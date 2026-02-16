/**
 * Experience Entity
 */
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  achievements: string[];
  skills: string[];
  technologies: string[];
  location?: string | null;
  employmentType?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project Entity
 */
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
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * BlogPost Entity
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category: string;
  tags: string[];
  coverImage?: string | null;
  published: boolean;
  publishedAt?: string | null;
  featured: boolean;
  views: number;
  readTime?: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * ContactSubmission Entity
 */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * ConsultationSubmission Entity
 */
export interface ConsultationSubmission {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  serviceType: string;
  budget?: string | null;
  timeline?: string | null;
  description: string;
  read: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create DTOs
 */
export interface CreateContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface CreateConsultationInput {
  name: string;
  email: string;
  company?: string;
  serviceType: string;
  budget?: string;
  timeline?: string;
  description: string;
}

/**
 * Admin User Entity
 */
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  active: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Auth DTOs
 */
export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

/**
 * Admin Experience DTOs
 */
export interface CreateExperienceInput {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  achievements?: string[];
  skills?: string[];
  technologies?: string[];
  location?: string | null;
  employmentType?: string | null;
  featured?: boolean;
  order?: number;
}

export interface UpdateExperienceInput {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string | null;
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
 * Admin Project DTOs
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
  startDate?: string | null;
  endDate?: string | null;
  order?: number;
}

export interface UpdateProjectInput {
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
  startDate?: string | null;
  endDate?: string | null;
  order?: number;
}

/**
 * Admin BlogPost DTOs
 */
export interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category: string;
  tags?: string[];
  coverImage?: string | null;
  published?: boolean;
  publishedAt?: string | null;
  featured?: boolean;
  readTime?: number | null;
}

export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  category?: string;
  tags?: string[];
  coverImage?: string | null;
  published?: boolean;
  publishedAt?: string | null;
  featured?: boolean;
  readTime?: number | null;
}
