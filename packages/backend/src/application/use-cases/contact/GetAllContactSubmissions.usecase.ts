import { IContactSubmissionRepository } from '../../../domain/interfaces/IContactSubmissionRepository.js';
import { ContactSubmission } from '../../../domain/entities/ContactSubmission.js';

/**
 * Use case: Get all contact submissions with optional filtering
 */
export class GetAllContactSubmissionsUseCase {
  constructor(private contactSubmissionRepository: IContactSubmissionRepository) {}

  async execute(options?: {
    read?: boolean;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ContactSubmission[]> {
    return await this.contactSubmissionRepository.findAll(options);
  }
}
