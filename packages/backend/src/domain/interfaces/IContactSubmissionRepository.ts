import {
  ContactSubmission,
  CreateContactSubmissionInput,
  UpdateContactSubmissionInput,
} from '../entities/ContactSubmission.js';

/**
 * ContactSubmission Repository Interface
 * Defines contract for ContactSubmission data access operations
 */
export interface IContactSubmissionRepository {
  /**
   * Find all contact submissions
   * @param options Optional filtering/sorting options
   */
  findAll(options?: {
    read?: boolean;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ContactSubmission[]>;

  /**
   * Find contact submission by ID
   * @param id Submission ID
   */
  findById(id: number): Promise<ContactSubmission | null>;

  /**
   * Create new contact submission
   * @param data Submission creation data
   */
  create(data: CreateContactSubmissionInput): Promise<ContactSubmission>;

  /**
   * Update contact submission (mark as read, add notes)
   * @param data Submission update data
   */
  update(data: UpdateContactSubmissionInput): Promise<ContactSubmission | null>;

  /**
   * Delete contact submission by ID
   * @param id Submission ID
   */
  delete(id: number): Promise<boolean>;

  /**
   * Count total submissions
   */
  count(options?: { read?: boolean }): Promise<number>;

  /**
   * Get unread count
   */
  getUnreadCount(): Promise<number>;
}
