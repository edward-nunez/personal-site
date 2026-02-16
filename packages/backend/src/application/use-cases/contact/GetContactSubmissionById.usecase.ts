import { IContactSubmissionRepository } from '../../../domain/interfaces/IContactSubmissionRepository.js';
import { ContactSubmission } from '../../../domain/entities/ContactSubmission.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Get contact submission by ID
 */
export class GetContactSubmissionByIdUseCase {
  constructor(private contactSubmissionRepository: IContactSubmissionRepository) {}

  async execute(id: string): Promise<ContactSubmission> {
    const submission = await this.contactSubmissionRepository.findById(id);

    if (!submission) {
      throw new NotFoundError('Contact submission not found');
    }

    return submission;
  }
}
