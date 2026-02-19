import type {
  IOllamaService,
  IPortfolioDataService,
} from '../../../domain/interfaces/IServices.js';
import type { ConversationResponse } from '../../../domain/entities/Assessment.js';
import { logger } from '../../../shared/utils/logger.js';

export class EngageInConversationUseCase {
  constructor(
    private ollamaService: IOllamaService,
    private portfolioDataService: IPortfolioDataService
  ) {}

  async execute(
    userMessage: string,
    context?: 'general' | 'technical' | 'culture',
    sessionId?: string
  ): Promise<ConversationResponse> {
    logger.info('EngageInConversationUseCase.execute started', { context, sessionId });

    try {
      // Fetch portfolio context
      const portfolio = await this.portfolioDataService.getPortfolioContext();
      const portfolioSummary = this.formatPortfolioSummary(portfolio);

      // Call Ollama for conversation
      const response = await this.ollamaService.engageInConversation(
        userMessage,
        context,
        portfolioSummary,
        sessionId
      );

      logger.info('EngageInConversationUseCase.execute completed', {
        sessionId: response.sessionId,
      });
      return response;
    } catch (error) {
      logger.error('EngageInConversationUseCase.execute failed', { error });
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
