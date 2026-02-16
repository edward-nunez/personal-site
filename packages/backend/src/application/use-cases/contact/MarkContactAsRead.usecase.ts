import { IContactSubmissionRepository } from '../../../domain/interfaces/IContactSubmissionRepository.js';
import { ContactSubmission } from '../../../domain/entities/ContactSubmission.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Mark contact submission as read
 */
export class MarkContactAsReadUseCase {
  constructor(private contactSubmissionRepository: IContactSubmissionRepository) {}

  async execute(id: string, notes?: string | null): Promise<ContactSubmission> {
    const submission = await this.contactSubmissionRepository.update({
      id,
      read: true,
      notes,
    });

    if (!submission) {
      throw new NotFoundError('Contact submission not found');
    }

    return submission;
  }
}
