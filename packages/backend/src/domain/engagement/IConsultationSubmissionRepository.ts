import {
  ConsultationSubmission,
  CreateConsultationSubmissionInput,
  UpdateConsultationSubmissionInput,
} from './ConsultationSubmission.js';

/**
 * ConsultationSubmission Repository Interface
 * Defines contract for ConsultationSubmission data access operations
 */
export interface IConsultationSubmissionRepository {
  /**
   * Find all consultation submissions
   * @param options Optional filtering/sorting options
   */
  findAll(options?: {
    read?: boolean;
    serviceType?: string;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ConsultationSubmission[]>;

  /**
   * Find consultation submission by ID
   * @param id Submission ID
   */
  findById(id: string): Promise<ConsultationSubmission | null>;

  /**
   * Create new consultation submission
   * @param data Submission creation data
   */
  create(data: CreateConsultationSubmissionInput): Promise<ConsultationSubmission>;

  /**
   * Update consultation submission (mark as read, add notes)
   * @param data Submission update data
   */
  update(data: UpdateConsultationSubmissionInput): Promise<ConsultationSubmission | null>;

  /**
   * Delete consultation submission by ID
   * @param id Submission ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count total submissions
   */
  count(options?: { read?: boolean; serviceType?: string }): Promise<number>;

  /**
   * Get unread count
   */
  getUnreadCount(): Promise<number>;

  /**
   * Get all unique service types
   */
  getServiceTypes(): Promise<string[]>;
}
