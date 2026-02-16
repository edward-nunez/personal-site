import { IContactSubmissionRepository } from '../../../domain/interfaces/IContactSubmissionRepository.js';
import {
  ContactSubmission,
  CreateContactSubmissionInput,
} from '../../../domain/entities/ContactSubmission.js';

/**
 * Use case: Create new contact submission
 */
export class CreateContactSubmissionUseCase {
  constructor(private contactSubmissionRepository: IContactSubmissionRepository) {}

  async execute(data: CreateContactSubmissionInput): Promise<ContactSubmission> {
    return await this.contactSubmissionRepository.create(data);
  }
}
