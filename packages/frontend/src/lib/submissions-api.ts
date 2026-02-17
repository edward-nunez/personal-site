import type {
  CreateContactSubmissionRequest,
  CreateConsultationSubmissionRequest,
  ContactSubmission,
  ConsultationSubmission,
} from '@/types';
import { apiPost } from './api';

const CONTACT_BASE = '/api/contact';
const CONSULTATION_BASE = '/api/consultation';

/**
 * Submit contact form. Returns created submission on success.
 */
export async function submitContact(
  data: CreateContactSubmissionRequest
): Promise<ContactSubmission> {
  const body = {
    name: data.name,
    email: data.email,
    subject: data.subject && data.subject.trim() ? data.subject.trim() : null,
    message: data.message,
  };
  return apiPost<ContactSubmission>(CONTACT_BASE, body);
}

/**
 * Submit consultation form. Returns created submission on success.
 */
export async function submitConsultation(
  data: CreateConsultationSubmissionRequest
): Promise<ConsultationSubmission> {
  const body = {
    name: data.name,
    email: data.email,
    company: data.company && data.company.trim() ? data.company.trim() : null,
    serviceType: data.serviceType,
    budget: data.budget || null,
    timeline: data.timeline || null,
    description: data.description,
  };
  return apiPost<ConsultationSubmission>(CONSULTATION_BASE, body);
}
