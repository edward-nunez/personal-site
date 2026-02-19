// Domain entity types for the assessment domain

export interface JobPosting {
  jobTitle: string;
  jobDescription: string;
  company?: string;
  requiredSkills?: string[];
  yearsExperience?: number;
  location?: string;
  type?: 'full-time' | 'contract' | 'part-time';
}

export interface CandidateStrength {
  title: string; // Short strength title (e.g., "Full-Stack Development")
  description: string; // 1-2 sentence explanation of why this matters for the role
}

export interface JobFitAssessment {
  fitScore: number; // 0-100 percentage
  fit: boolean; // true if fitScore 70+, false otherwise
  recommendation: string; // Edward's perspective with tone appropriate to fit score
  strengths: CandidateStrength[]; // Top 3 most relevant strengths for the role
  gaps: string[]; // Potential areas of mismatch or growth (showstoppers vs. trainable)
}

export interface ConversationMessage {
  message: string;
  context?: 'general' | 'technical' | 'culture'; // Helps tailor the response
  sessionId?: string; // Optional session ID to continue a conversation
}

export interface ConversationResponse {
  reply: string;
  sessionId: string; // Session ID for continuing the conversation
}

export interface PortfolioContext {
  experiences: Array<{
    title: string;
    company: string;
    years: number;
    skills: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  skills: string[];
  certifications?: string[];
}
