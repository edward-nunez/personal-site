import type {
  IOllamaService,
  IPortfolioDataService,
} from '../../../domain/interfaces/IServices.js';
import type { JobFitAssessment } from '../../../domain/entities/Assessment.js';
import { logger } from '../../../shared/utils/logger.js';

export class ReviewJobOpportunityUseCase {
  constructor(
    private ollamaService: IOllamaService,
    private portfolioDataService: IPortfolioDataService
  ) {}

  async execute(jobPosting: {
    jobTitle: string;
    jobDescription: string;
  }): Promise<JobFitAssessment> {
    logger.info('ReviewJobOpportunityUseCase.execute started', {
      jobTitle: jobPosting.jobTitle,
    });

    try {
      // Fetch portfolio context
      const portfolio = await this.portfolioDataService.getPortfolioContext();
      const portfolioSummary = this.formatPortfolioSummary(portfolio);

      // Call Ollama for assessment
      const assessment = await this.ollamaService.assessJobFit(jobPosting, portfolioSummary);

      logger.info('ReviewJobOpportunityUseCase.execute completed', {
        jobTitle: jobPosting.jobTitle,
        fitScore: assessment.fitScore,
      });

      return assessment;
    } catch (error) {
      logger.error('ReviewJobOpportunityUseCase.execute failed', { error });
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatPortfolioSummary(portfolio: any): string {
    const experienceSummary = portfolio.experiences
      .map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (exp: any) =>
          `- ${exp.title} at ${exp.company} (${exp.years} years) - Skills: ${(exp.skills || []).join(', ')}`
      )
      .join('\n');

    const projectSummary = portfolio.projects
      .map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (proj: any) =>
          `- ${proj.name}: ${proj.description} (${(proj.technologies || []).join(', ')})`
      )
      .join('\n');

    return `
PROFESSIONAL EXPERIENCE:
${experienceSummary}

KEY PROJECTS:
${projectSummary}

CORE SKILLS:
${portfolio.skills.join(', ')}
`;
  }
}
