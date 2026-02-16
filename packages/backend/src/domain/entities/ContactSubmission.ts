/**
 * ContactSubmission Domain Entity
 * Represents a contact form submission
 */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating new contact submission
 */
export interface CreateContactSubmissionInput {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

/**
 * DTO for updating contact submission (admin only - mark as read, add notes)
 */
export interface UpdateContactSubmissionInput {
  id: string;
  read?: boolean;
  notes?: string | null;
}
