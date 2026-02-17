/**
 * Contact and Consultation submission types aligned with backend DTOs.
 * Use these for form state and API request payloads.
 */

/** Contact submission as returned from API */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** Payload for POST contact submit (matches CreateContactSubmissionSchema) */
export interface CreateContactSubmissionRequest {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

/** Consultation submission as returned from API */
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
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** Payload for POST consultation submit (matches CreateConsultationSubmissionSchema) */
export interface CreateConsultationSubmissionRequest {
  name: string;
  email: string;
  company?: string | null;
  serviceType: string;
  budget?: string | null;
  timeline?: string | null;
  description: string;
}
