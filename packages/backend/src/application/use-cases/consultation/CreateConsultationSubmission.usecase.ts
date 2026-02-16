import { IConsultationSubmissionRepository } from '../../../domain/interfaces/IConsultationSubmissionRepository.js';
import {
  ConsultationSubmission,
  CreateConsultationSubmissionInput,
} from '../../../domain/entities/ConsultationSubmission.js';

/**
 * Use case: Create new consultation submission
 */
export class CreateConsultationSubmissionUseCase {
  constructor(private consultationSubmissionRepository: IConsultationSubmissionRepository) {}

  async execute(data: CreateConsultationSubmissionInput): Promise<ConsultationSubmission> {
    return await this.consultationSubmissionRepository.create(data);
  }
}
