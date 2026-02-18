import axios, { AxiosInstance } from 'axios';
import type { IPortfolioDataService } from '../../domain/interfaces/IServices.js';
import type { PortfolioContext } from '../../domain/entities/Assessment.js';
import { logger } from '../../shared/utils/logger.js';

export class PortfolioDataService implements IPortfolioDataService {
  private client: AxiosInstance;
  private backendUrl: string;

  constructor() {
    this.backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';
    this.client = axios.create({
      baseURL: this.backendUrl,
      timeout: 5000,
    });
  }

  async getPortfolioContext(): Promise<PortfolioContext> {
    try {
      logger.info('Fetching portfolio context from backend');

      // Fetch experiences and projects from the backend API
      const [experiencesRes, projectsRes] = await Promise.all([
        this.client.get('/api/experiences'),
        this.client.get('/api/projects'),
      ]);

      const experiences = experiencesRes.data.data || [];
      const projects = projectsRes.data.data || [];

      // Extract skills from experiences and projects
      const skillsSet = new Set<string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      experiences.forEach((exp: any) => {
        if (Array.isArray(exp.skills)) {
          exp.skills.forEach((skill: string) => skillsSet.add(skill));
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects.forEach((proj: any) => {
        if (Array.isArray(proj.technologies)) {
          proj.technologies.forEach((tech: string) => skillsSet.add(tech));
        }
      });

      const portfolioContext: PortfolioContext = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        experiences: experiences.map((exp: any) => ({
          title: exp.title || '',
          company: exp.company || '',
          years: exp.yearsOfExperience || 0,
          skills: exp.skills || [],
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects: projects.map((proj: any) => ({
          name: proj.title || '',
          description: proj.description || '',
          technologies: proj.technologies || [],
        })),
        skills: Array.from(skillsSet),
        certifications: [],
      };

      logger.info('Portfolio context fetched successfully', {
        numExperiences: portfolioContext.experiences.length,
        numProjects: portfolioContext.projects.length,
        numSkills: portfolioContext.skills.length,
      });

      return portfolioContext;
    } catch (error) {
      logger.error('Error fetching portfolio context in PortfolioDataService', { error });

      // Return a fallback context if backend is unavailable
      logger.warn('Returning fallback portfolio context');
      return {
        experiences: [
          {
            title: 'Senior Developer',
            company: 'Your Company',
            years: 1,
            skills: ['TypeScript', 'Node.js', 'React'],
          },
        ],
        projects: [
          {
            name: 'Sample Project',
            description: 'A sample project showcasing your portfolio',
            technologies: ['TypeScript', 'Express', 'React'],
          },
        ],
        skills: ['TypeScript', 'Node.js', 'React', 'Express', 'PostgreSQL'],
        certifications: [],
      };
    }
  }
}
