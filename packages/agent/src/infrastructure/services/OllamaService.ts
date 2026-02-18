import axios, { AxiosInstance } from 'axios';
import type { IOllamaService } from '../../domain/interfaces/IServices.js';
import type { JobFitAssessment, ConversationResponse } from '../../domain/entities/Assessment.js';
import { OllamaConnectionError, OllamaTimeoutError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import { conversationSessionManager } from './ConversationSessionManager.js';

export class OllamaService implements IOllamaService {
  private client: AxiosInstance;
  private ollama_url: string;
  private model: string;

  constructor() {
    this.ollama_url = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'neural-chat';

    this.client = axios.create({
      baseURL: this.ollama_url,
      timeout: 30000, // 30 second timeout for inference
    });
  }

  async assessJobFit(
    jobPosting: { jobTitle: string; jobDescription: string },
    portfolioContext: string
  ): Promise<JobFitAssessment> {
    const systemPrompt = `## Role
You are an objective candidate-job fit evaluator speaking as Edward Nunez. Your assessment helps hiring managers determine whether to proceed with this opportunity.

## Context: Candidate Profile
${portfolioContext}

## Task
Compare Edward's professional background to the job opportunity and provide a structured, evidence-based assessment written from Edward's first-person perspective.

## Evaluation Criteria
Score fit from 0-100 based on:
- **Skill Alignment** (40%): Does Edward have the required technical and soft skills?
- **Experience Level** (30%): Does his experience match the seniority/depth required?
- **Domain Knowledge** (20%): Is he familiar with the industry/domain?
- **Growth Potential** (10%): Can he grow into areas where he has gaps?

## Output Format
Respond ONLY in valid JSON with no markdown, code blocks, or text outside the JSON:
{
  "fitScore": <0-100 percentage>,
  "fit": <true if fitScore 70+, false if below 70>,
  "strengths": [{"title": "<short strength title>", "description": "<1-2 sentences from Edward's first-person perspective about why this is relevant to the role>"}, ...max 3 items],
  "gaps": ["<from Edward's first-person perspective: skill/experience gap and its importance to the role>", "<gap2>"],
  "recommendation": "<Edward's first-person perspective using appropriate tone for fit score range>"
}

## Guidelines
- Write all strengths and gaps from Edward's first-person perspective ("I have", "My experience", "I can")
- Tone: Professional but light-hearted and enthusiastic
- Recommendation Tone by Fit Score:
  * 90–100: Very strong/enthusiastic - "Highly recommended", "Excellent match", convey Edward's strong value add
  * 80–89: Strong/confident - "Strongly recommended", "Great fit", clear value proposition
  * 70–79: Positive/encouraging - "Recommended", "Solid candidate", solid value add
  * 60–69: Neutral/cautious - "Possible fit", "Consider with reservations", acknowledge gaps honestly
  * 50–59: Mildly discouraging - "Limited fit", "May require significant ramp-up", sincere about misalignment
  * <50: Discouraging - "Not recommended", "Poor alignment", express interest in better-fit roles
- Identify and highlight the top 3 most relevant strengths for this role
- Each strength must have a clear title and 1-2 sentence explanation of why it matters
- Be specific and reference actual projects or experience from Edward's profile
- Prioritize role requirements when selecting which strengths to highlight
- For gaps, acknowledge them authentically but frame as growth opportunities
- Assume improvements in non-critical areas are possible with training`;

    const userPrompt = `Job Title: ${jobPosting.jobTitle}

Job Description:
${jobPosting.jobDescription}

Please assess if this is a good fit.`;

    try {
      logger.info('Sending job assessment request to Ollama', {
        model: this.model,
        jobTitle: jobPosting.jobTitle,
      });

      const response = await this.client.post('/api/chat', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        stream: false,
        temperature: 0.3, // Lower temperature for more consistent, focused responses
      });

      const content = response.data.message.content.trim();

      console.log('Raw response from Ollama:', content);
      // Parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON response from Ollama');
      }

      const assessment = JSON.parse(jsonMatch[0]) as JobFitAssessment;

      logger.info('Job assessment completed', { fitScore: assessment.fitScore });
      return assessment;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new OllamaConnectionError(
            'Ollama service is not running. Please start Ollama with: ollama serve',
            error.message
          );
        }
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          throw new OllamaTimeoutError(
            'Ollama inference took too long. The model may still be loading.',
            error.message
          );
        }
      }
      logger.error('Error during job assessment', { error });
      throw error;
    }
  }

  async engageInConversation(
    userMessage: string,
    context: 'general' | 'technical' | 'culture' | undefined,
    portfolioContext: string,
    sessionId?: string
  ): Promise<ConversationResponse> {
    const contextHint =
      context === 'technical'
        ? 'Focus on technical skills and project experience.'
        : context === 'culture'
          ? 'Focus on work ethic, collaboration, and cultural fit.'
          : 'Provide a balanced, authentic response drawing from professional experience.';

    const systemPrompt = `## Role
You are an Assistant speaking on behalf of Edward Nunez. You represent Edward in conversations with potential employers, collaborators, and other stakeholders.

## Context: Edward's Professional Profile
${portfolioContext}

## Task
Answer questions about Edward honestly and directly, drawing only from his documented professional background and experience.

## Context for This Response
${contextHint}

## Guidelines
- Draw only from documented facts in Edward's profile
- Be honest and straightforward in all responses
- If a question addresses something not documented in Edward's history, clearly state: "Edward's background doesn't show experience with [topic]" or "I don't have documented experience with that"
- Never fabricate, exaggerate, or make assumptions about Edward's skills, experience, or achievements
- Keep responses concise and conversational (2-3 sentences)
- Be confident but not arrogant
- Ask clarifying questions when appropriate to better understand the person's needs
- Be honest about areas where Edward is still learning or wants to grow
- Maintain professional but light-hearted and enthusiastic tone`;

    try {
      // Get or create conversation session
      let messages;
      let currentSessionId: string;

      if (sessionId) {
        // Try to retrieve existing session
        const existingMessages = conversationSessionManager.getSession(sessionId);

        if (existingMessages) {
          // Session found and valid
          messages = [...existingMessages, { role: 'user' as const, content: userMessage }];
          currentSessionId = sessionId;
          logger.debug('Using existing conversation session', { sessionId });
        } else {
          // Session expired or not found, create new one
          currentSessionId = conversationSessionManager.createSession(systemPrompt);
          messages = [
            { role: 'system' as const, content: systemPrompt },
            { role: 'user' as const, content: userMessage },
          ];
          logger.debug('Session expired/not found, created new session', {
            oldSessionId: sessionId,
            newSessionId: currentSessionId,
          });
        }
      } else {
        // No session ID provided, create new session
        currentSessionId = conversationSessionManager.createSession(systemPrompt);
        messages = [
          { role: 'system' as const, content: systemPrompt },
          { role: 'user' as const, content: userMessage },
        ];
        logger.debug('Created new conversation session', { sessionId: currentSessionId });
      }

      logger.info('Sending conversation message to Ollama', {
        context,
        sessionId: currentSessionId,
        messageCount: messages.length,
      });

      const response = await this.client.post('/api/chat', {
        model: this.model,
        messages,
        stream: false,
        temperature: 0.7, // Higher temperature for more natural, varied responses
      });

      const reply = response.data.message.content.trim();

      // Add the exchange to the session
      conversationSessionManager.addExchange(currentSessionId, userMessage, reply);

      logger.info('Conversation response generated', { sessionId: currentSessionId });
      return { reply, sessionId: currentSessionId };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new OllamaConnectionError('Ollama service is not running.', error.message);
        }
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          throw new OllamaTimeoutError('Request to Ollama timed out.', error.message);
        }
      }
      logger.error('Error during conversation', { error });
      throw error;
    }
  }
}
