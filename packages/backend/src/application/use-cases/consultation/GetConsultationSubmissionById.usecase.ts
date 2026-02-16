import { IConsultationSubmissionRepository } from '../../../domain/interfaces/IConsultationSubmissionRepository.js';
import { ConsultationSubmission } from '../../../domain/entities/ConsultationSubmission.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

/**
 * Use case: Get consultation submission by ID
 */
export class GetConsultationSubmissionByIdUseCase {
  constructor(private consultationSubmissionRepository: IConsultationSubmissionRepository) {}

  async execute(id: string): Promise<ConsultationSubmission> {
    const submission = await this.consultationSubmissionRepository.findById(id);

    if (!submission) {
      throw new NotFoundError('Consultation submission not found');
    }

    return submission;
  }
}
