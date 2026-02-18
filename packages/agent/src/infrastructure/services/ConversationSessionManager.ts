import { randomUUID } from 'crypto';
import { logger } from '../../shared/utils/logger.js';

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ConversationSession {
  messages: ConversationMessage[];
  lastActive: Date;
}

/**
 * In-memory conversation session manager with automatic TTL-based cleanup.
 * Sessions expire after a configurable period of inactivity.
 *
 * Why in-memory: Privacy-preserving (no database storage), automatic cleanup on restart
 */
export class ConversationSessionManager {
  private sessions: Map<string, ConversationSession>;
  private ttlMinutes: number;
  private cleanupIntervalMs: number;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(ttlMinutes = 30, cleanupIntervalMinutes = 5) {
    this.sessions = new Map();
    this.ttlMinutes = ttlMinutes;
    this.cleanupIntervalMs = cleanupIntervalMinutes * 60 * 1000;

    // Start background cleanup task
    this.startCleanupTask();

    logger.info('ConversationSessionManager initialized', {
      ttlMinutes,
      cleanupIntervalMinutes,
    });
  }

  /**
   * Create a new conversation session with system prompt
   */
  createSession(systemPrompt: string): string {
    const sessionId = randomUUID();

    this.sessions.set(sessionId, {
      messages: [{ role: 'system', content: systemPrompt }],
      lastActive: new Date(),
    });

    logger.debug('Created new conversation session', { sessionId });
    return sessionId;
  }

  /**
   * Get conversation history for a session, or null if expired/not found
   */
  getSession(sessionId: string): ConversationMessage[] | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      logger.debug('Session not found', { sessionId });
      return null;
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.lastActive.getTime() + this.ttlMinutes * 60 * 1000);

    if (now > expiresAt) {
      logger.debug('Session expired', { sessionId, lastActive: session.lastActive });
      this.sessions.delete(sessionId);
      return null;
    }

    // Update last active timestamp
    session.lastActive = new Date();
    return [...session.messages]; // Return copy to prevent external mutation
  }

  /**
   * Add a user message and assistant response to the session
   */
  addExchange(sessionId: string, userMessage: string, assistantReply: string): void {
    const session = this.sessions.get(sessionId);

    if (!session) {
      logger.warn('Attempted to add exchange to non-existent session', { sessionId });
      return;
    }

    session.messages.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantReply }
    );
    session.lastActive = new Date();

    // Limit conversation history to prevent unbounded growth (keep last 20 messages + system)
    const maxMessages = 21; // system prompt + 10 exchanges (user + assistant)
    if (session.messages.length > maxMessages) {
      // Keep system prompt (first message) and most recent exchanges
      const systemPrompt = session.messages[0];
      const recentMessages = session.messages.slice(-20);
      session.messages = [systemPrompt, ...recentMessages];

      logger.debug('Truncated conversation history', {
        sessionId,
        messageCount: session.messages.length,
      });
    }
  }

  /**
   * Manually delete a session (e.g., on user logout or explicit end)
   */
  deleteSession(sessionId: string): void {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      logger.debug('Deleted conversation session', { sessionId });
    }
  }

  /**
   * Background task to remove expired sessions
   */
  private startCleanupTask(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupIntervalMs);

    // Don't prevent process from exiting
    this.cleanupTimer.unref();
  }

  /**
   * Remove all expired sessions
   */
  private cleanup(): void {
    const now = new Date();
    let expiredCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const expiresAt = new Date(session.lastActive.getTime() + this.ttlMinutes * 60 * 1000);

      if (now > expiresAt) {
        this.sessions.delete(sessionId);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      logger.info('Cleaned up expired conversation sessions', {
        expiredCount,
        remainingSessions: this.sessions.size,
      });
    }
  }

  /**
   * Get statistics about active sessions (for monitoring/debugging)
   */
  getStats(): { activeSessions: number; ttlMinutes: number } {
    return {
      activeSessions: this.sessions.size,
      ttlMinutes: this.ttlMinutes,
    };
  }

  /**
   * Shutdown cleanup task (call on application shutdown)
   */
  shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.sessions.clear();
    logger.info('ConversationSessionManager shutdown');
  }
}

// Singleton instance for the application
export const conversationSessionManager = new ConversationSessionManager();
