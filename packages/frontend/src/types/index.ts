/**
 * Frontend types aligned with backend entities and DTOs.
 * Use for API request/response shapes and form payloads.
 */

export type { ProjectContentBlock, ContentBlock } from './content';
export type { Project, ProjectDisplay, ProjectStatus } from './project';
export type { BlogPost, BlogPostDisplay } from './blog';
export type {
  ContactSubmission,
  CreateContactSubmissionRequest,
  ConsultationSubmission,
  CreateConsultationSubmissionRequest,
} from './submissions';
export type { Experience } from './experience';
export type { ToolkitCategory } from './toolkit';
