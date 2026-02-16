import { IConsultationSubmissionRepository } from '../../../domain/interfaces/IConsultationSubmissionRepository.js';
import { ConsultationSubmission } from '../../../domain/entities/ConsultationSubmission.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Mark consultation submission as read
 */
export class MarkConsultationAsReadUseCase {
  constructor(private consultationSubmissionRepository: IConsultationSubmissionRepository) {}

  async execute(id: string, notes?: string | null): Promise<ConsultationSubmission> {
    const submission = await this.consultationSubmissionRepository.update({
      id,
      read: true,
      notes,
    });

    if (!submission) {
      throw new NotFoundError('Consultation submission not found');
    }

    return submission;
  }
}
