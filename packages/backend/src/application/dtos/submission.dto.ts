import { z } from 'zod';

/**
 * Validation schema for contact form submission
 */
export const CreateContactSubmissionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(200),
  subject: z.string().max(200).nullable().optional(),
  message: z.string().min(1, 'Message is required').max(5000),
});

/**
 * Validation schema for consultation request
 */
export const CreateConsultationSubmissionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(200),
  company: z.string().max(200).nullable().optional(),
  serviceType: z.string().min(1, 'Service type is required').max(200),
  budget: z.string().max(100).nullable().optional(),
  timeline: z.string().max(200).nullable().optional(),
  description: z.string().min(1, 'Description is required').max(5000),
});

export type CreateContactSubmissionDTO = z.infer<typeof CreateContactSubmissionSchema>;
export type CreateConsultationSubmissionDTO = z.infer<typeof CreateConsultationSubmissionSchema>;
