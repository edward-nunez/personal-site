import { useState } from 'react';
import { useAdminContacts, useAdminConsultations } from '@/core/api/queries';
import {
  useMarkContactAsRead,
  useDeleteContact,
  useMarkConsultationAsRead,
  useDeleteConsultation,
} from '@/core/api/mutations';
import { DataTable, ConfirmDeleteModal, type Column } from '../components';
import { Button, Modal } from '@/design-system/components';
import type { ContactSubmission, ConsultationSubmission } from '@/types';
import { cn } from '@/utils';

type Tab = 'contacts' | 'consultations';

export function AdminSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationSubmission | null>(
    null
  );
  const [deletingContact, setDeletingContact] = useState<ContactSubmission | null>(null);
  const [deletingConsultation, setDeletingConsultation] = useState<ConsultationSubmission | null>(
    null
  );

  const { data: contacts, isLoading: contactsLoading } = useAdminContacts();
  const { data: consultations, isLoading: consultationsLoading } = useAdminConsultations();

  const markContactAsRead = useMarkContactAsRead();
  const deleteContact = useDeleteContact();
  const markConsultationAsRead = useMarkConsultationAsRead();
  const deleteConsultation = useDeleteConsultation();

  const handleToggleContactRead = async (contact: ContactSubmission) => {
    await markContactAsRead.mutateAsync({ id: contact.id });
  };

  const handleToggleConsultationRead = async (consultation: ConsultationSubmission) => {
    await markConsultationAsRead.mutateAsync({ id: consultation.id });
  };

  const handleDeleteContact = async () => {
    if (!deletingContact) return;
    await deleteContact.mutateAsync(deletingContact.id);
    setDeletingContact(null);
  };

  const handleDeleteConsultation = async () => {
    if (!deletingConsultation) return;
    await deleteConsultation.mutateAsync(deletingConsultation.id);
    setDeletingConsultation(null);
  };

  const contactColumns: Column<ContactSubmission>[] = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      header: 'Subject',
      accessor: 'subject',
      render: (value) => (value as string) || '—',
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'read',
      render: (value, row) => (
        <button
          onClick={() => handleToggleContactRead(row)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value
              ? 'bg-surface-hover text-fg-muted hover:bg-surface-hover/80'
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          }`}
        >
          {value ? 'Read' : 'Unread'}
        </button>
      ),
    },
  ];

  const consultationColumns: Column<ConsultationSubmission>[] = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      header: 'Company',
      accessor: 'company',
      render: (value) => (value as string) || '—',
    },
    {
      header: 'Service Type',
      accessor: 'serviceType',
      sortable: true,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'read',
      render: (value, row) => (
        <button
          onClick={() => handleToggleConsultationRead(row)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value
              ? 'bg-surface-hover text-fg-muted hover:bg-surface-hover/80'
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          }`}
        >
          {value ? 'Read' : 'Unread'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-fg mb-2">Submissions</h1>
        <p className="text-fg-secondary">View and manage contact and consultation submissions</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('contacts')}
            className={cn(
              'px-4 py-2 border-b-2 font-medium transition-colors',
              activeTab === 'contacts'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-secondary hover:text-fg'
            )}
          >
            Contact Submissions
            {contacts && contacts.filter((c) => !c.read).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                {contacts.filter((c) => !c.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={cn(
              'px-4 py-2 border-b-2 font-medium transition-colors',
              activeTab === 'consultations'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-secondary hover:text-fg'
            )}
          >
            Consultation Requests
            {consultations && consultations.filter((c) => !c.read).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                {consultations.filter((c) => !c.read).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'contacts' ? (
        <DataTable
          columns={contactColumns}
          data={contacts || []}
          isLoading={contactsLoading}
          rowKey="id"
          searchPlaceholder="Search contacts..."
          actions={(row) => (
            <>
              <Button variant="ghost" size="sm" onClick={() => setSelectedContact(row)}>
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeletingContact(row)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </Button>
            </>
          )}
        />
      ) : (
        <DataTable
          columns={consultationColumns}
          data={consultations || []}
          isLoading={consultationsLoading}
          rowKey="id"
          searchPlaceholder="Search consultations..."
          actions={(row) => (
            <>
              <Button variant="ghost" size="sm" onClick={() => setSelectedConsultation(row)}>
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeletingConsultation(row)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </Button>
            </>
          )}
        />
      )}

      {/* Contact details modal */}
      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title="Contact Submission Details"
      >
        {selectedContact && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-fg-secondary">Name</label>
              <p className="text-fg mt-1">{selectedContact.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-fg-secondary">Email</label>
              <p className="text-fg mt-1">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-accent hover:text-accent-hover"
                >
                  {selectedContact.email}
                </a>
              </p>
            </div>
            {selectedContact.subject && (
              <div>
                <label className="text-sm font-medium text-fg-secondary">Subject</label>
                <p className="text-fg mt-1">{selectedContact.subject}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-fg-secondary">Message</label>
              <p className="text-fg mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-fg-secondary">Submitted</label>
              <p className="text-fg mt-1">{new Date(selectedContact.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedContact(null)}>
                Close
              </Button>
              {!selectedContact.read && (
                <Button
                  variant="primary"
                  onClick={async () => {
                    await handleToggleContactRead(selectedContact);
                    setSelectedContact(null);
                  }}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Consultation details modal */}
      <Modal
        isOpen={!!selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
        title="Consultation Request Details"
      >
        {selectedConsultation && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-fg-secondary">Name</label>
              <p className="text-fg mt-1">{selectedConsultation.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-fg-secondary">Email</label>
              <p className="text-fg mt-1">
                <a
                  href={`mailto:${selectedConsultation.email}`}
                  className="text-accent hover:text-accent-hover"
                >
                  {selectedConsultation.email}
                </a>
              </p>
            </div>
            {selectedConsultation.company && (
              <div>
                <label className="text-sm font-medium text-fg-secondary">Company</label>
                <p className="text-fg mt-1">{selectedConsultation.company}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-fg-secondary">Service Type</label>
              <p className="text-fg mt-1">{selectedConsultation.serviceType}</p>
            </div>
            {selectedConsultation.budget && (
              <div>
                <label className="text-sm font-medium text-fg-secondary">Budget</label>
                <p className="text-fg mt-1">{selectedConsultation.budget}</p>
              </div>
            )}
            {selectedConsultation.timeline && (
              <div>
                <label className="text-sm font-medium text-fg-secondary">Timeline</label>
                <p className="text-fg mt-1">{selectedConsultation.timeline}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-fg-secondary">Description</label>
              <p className="text-fg mt-1 whitespace-pre-wrap">{selectedConsultation.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-fg-secondary">Submitted</label>
              <p className="text-fg mt-1">
                {new Date(selectedConsultation.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedConsultation(null)}>
                Close
              </Button>
              {!selectedConsultation.read && (
                <Button
                  variant="primary"
                  onClick={async () => {
                    await handleToggleConsultationRead(selectedConsultation);
                    setSelectedConsultation(null);
                  }}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modals */}
      <ConfirmDeleteModal
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleDeleteContact}
        entityName={deletingContact ? `contact from ${deletingContact.name}` : ''}
        isLoading={deleteContact.isPending}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingConsultation}
        onClose={() => setDeletingConsultation(null)}
        onConfirm={handleDeleteConsultation}
        entityName={deletingConsultation ? `consultation from ${deletingConsultation.name}` : ''}
        isLoading={deleteConsultation.isPending}
      />
    </div>
  );
}
