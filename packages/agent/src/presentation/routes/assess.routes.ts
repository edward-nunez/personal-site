import { Router, Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/authMiddleware.js';
import {
  JobFitRequestSchema,
  ConversationRequestSchema,
} from '../../application/dtos/assessment.dto.js';
import { ReviewJobOpportunityUseCase } from '../../application/use-cases/assessment/ReviewJobOpportunity.usecase.js';
import { EngageInConversationUseCase } from '../../application/use-cases/assessment/EngageInConversation.usecase.js';
import { OllamaService } from '../../infrastructure/services/OllamaService.js';
import { PortfolioDataService } from '../../infrastructure/services/PortfolioDataService.js';
import { ValidationError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/utils/logger.js';

const router = Router();

// Initialize services and use cases
const ollamaService = new OllamaService();
const portfolioDataService = new PortfolioDataService();
const reviewJobUseCase = new ReviewJobOpportunityUseCase(ollamaService, portfolioDataService);
const conversationUseCase = new EngageInConversationUseCase(ollamaService, portfolioDataService);

/**
 * POST /api/assess/job-fit
 * Assess how well a job opportunity aligns with the candidate's profile.
 *
 * Request body:
 * {
 *   "jobTitle": "Senior DevOps Engineer",
 *   "jobDescription": "We're looking for...",
 *   "company": "Tech Corp",
 *   "requiredSkills": ["Kubernetes", "AWS"],
 *   "yearsExperience": 5,
 *   "location": "Remote",
 *   "type": "full-time"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "fitScore": 78,
 *     "fit": true,
 *     "recommendation": "<tone varies by fit score: 90+=highly recommended, 80+=strong, 70+=recommended, <70=with reservations or not recommended>",
 *     "strengths": [{"title": "...", "description": "..."}, {"title": "...", "description": "..."}],
 *     "gaps": ["..."]
 *   }
 * }
 */
router.post('/job-fit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const validatedData = JobFitRequestSchema.parse(req.body);

    logger.info('Job fit assessment request received', {
      userId: req.user?.id,
      jobTitle: validatedData.jobTitle,
    });

    const assessment = await reviewJobUseCase.execute({
      jobTitle: validatedData.jobTitle,
      jobDescription: validatedData.jobDescription,
    });

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      throw new ValidationError('Invalid request data', error);
    }
    throw error;
  }
});

/**
 * POST /api/assess/conversation
 * Engage in a conversation simulating the candidate responding to inquiries.
 * Supports multi-turn conversations through session management (in-memory with TTL).
 *
 * Request body:
 * {
 *   "message": "Tell me about your experience with Kubernetes",
 *   "context": "technical",
 *   "sessionId": "optional-uuid-to-continue-conversation"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "reply": "I have extensive experience with Kubernetes...",
 *     "sessionId": "uuid-for-continuing-this-conversation"
 *   }
 * }
 */
router.post('/conversation', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const validatedData = ConversationRequestSchema.parse(req.body);

    logger.info('Conversation request received', {
      userId: req.user?.id,
      context: validatedData.context,
      sessionId: validatedData.sessionId,
    });

    const response = await conversationUseCase.execute(
      validatedData.message,
      validatedData.context,
      validatedData.sessionId
    );

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      throw new ValidationError('Invalid request data', error);
    }
    throw error;
  }
});

/**
 * GET /api/assess/health
 * Health check endpoint (public, no auth required)
 */
router.get('/health', (_req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: 'healthy' },
  });
});

export default router;
