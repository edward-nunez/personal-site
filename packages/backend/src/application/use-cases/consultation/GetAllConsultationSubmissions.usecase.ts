import { IConsultationSubmissionRepository } from '../../../domain/interfaces/IConsultationSubmissionRepository.js';
import { ConsultationSubmission } from '../../../domain/entities/ConsultationSubmission.js';

/**
 * Use case: Get all consultation submissions with optional filtering
 */
export class GetAllConsultationSubmissionsUseCase {
  constructor(private consultationSubmissionRepository: IConsultationSubmissionRepository) {}

  async execute(options?: {
    read?: boolean;
    serviceType?: string;
    orderBy?: 'createdAt';
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ConsultationSubmission[]> {
    return await this.consultationSubmissionRepository.findAll(options);
  }
}
