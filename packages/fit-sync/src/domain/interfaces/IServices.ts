import type {
  JobFitAssessment,
  ConversationResponse,
  PortfolioContext,
} from '../entities/Assessment.js';

// Repository interface for Ollama LLM service
export interface IOllamaService {
  assessJobFit(
    jobPosting: { jobTitle: string; jobDescription: string },
    portfolioContext: string
  ): Promise<JobFitAssessment>;

  engageInConversation(
    userMessage: string,
    context: 'general' | 'technical' | 'culture' | undefined,
    portfolioContext: string,
    sessionId?: string
  ): Promise<ConversationResponse>;
}

// Repository interface for fetching portfolio data
export interface IPortfolioDataService {
  getPortfolioContext(): Promise<PortfolioContext>;
}
