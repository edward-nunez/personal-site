/**
 * ConsultationSubmission Domain Entity
 * Represents a consultation request form submission
 */
export interface ConsultationSubmission {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  serviceType: string;
  budget?: string | null;
  timeline?: string | null;
  description: string;
  read: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating new consultation submission
 */
export interface CreateConsultationSubmissionInput {
  name: string;
  email: string;
  company?: string | null;
  serviceType: string;
  budget?: string | null;
  timeline?: string | null;
  description: string;
}

/**
 * DTO for updating consultation submission (admin only)
 */
export interface UpdateConsultationSubmissionInput {
  id: string;
  read?: boolean;
  notes?: string | null;
}
