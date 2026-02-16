import { useState } from 'react';
import { z } from 'zod';
import { useAdminExperiences } from '@/core/api/queries';
import {
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '@/core/api/mutations';
import {
  DataTable,
  ConfirmDeleteModal,
  EntityForm,
  type Column,
  type FieldDefinition,
} from '../components';
import { Button, Modal } from '@/design-system/components';
import type { Experience, CreateExperienceInput, UpdateExperienceInput } from '@/types';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  location: z.string().optional().nullable(),
  employmentType: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

const formFields: FieldDefinition[] = [
  { name: 'company', label: 'Company', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text', required: true },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date' },
  { name: 'location', label: 'Location', type: 'text' },
  {
    name: 'employmentType',
    label: 'Employment Type',
    type: 'text',
    placeholder: 'e.g., Full-time, Contract',
  },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  {
    name: 'achievements',
    label: 'Achievements',
    type: 'tags',
    placeholder: 'Type and press Enter',
  },
  { name: 'skills', label: 'Skills', type: 'tags', placeholder: 'Type and press Enter' },
  {
    name: 'technologies',
    label: 'Technologies',
    type: 'tags',
    placeholder: 'Type and press Enter',
  },
  { name: 'featured', label: 'Featured', type: 'checkbox' },
  { name: 'order', label: 'Display Order', type: 'number' },
];

export function AdminExperiencePage() {
  const { data: experiences, isLoading } = useAdminExperiences();
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deletingExperience, setDeletingExperience] = useState<Experience | null>(null);

  const columns: Column<Experience>[] = [
    {
      header: 'Company',
      accessor: 'company',
      sortable: true,
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
    },
    {
      header: 'Start Date',
      accessor: 'startDate',
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      render: (value) => (value ? new Date(value as string).toLocaleDateString() : 'Present'),
    },
    {
      header: 'Featured',
      accessor: 'featured',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value ? 'bg-accent/20 text-accent' : 'bg-surface-hover text-fg-muted'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  const handleCreate = async (data: CreateExperienceInput) => {
    await createMutation.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (data: UpdateExperienceInput) => {
    if (!editingExperience) return;
    await updateMutation.mutateAsync({ id: editingExperience.id, data });
    setEditingExperience(null);
  };

  const handleDelete = async () => {
    if (!deletingExperience) return;
    await deleteMutation.mutateAsync(deletingExperience.id);
    setDeletingExperience(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg mb-2">Experience Management</h1>
          <p className="text-fg-secondary">Manage your work experience entries</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <span className="mr-2">+</span>
          Add Experience
        </Button>
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={experiences || []}
        isLoading={isLoading}
        rowKey="id"
        searchPlaceholder="Search experiences..."
        actions={(row) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditingExperience(row)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingExperience(row)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </Button>
          </>
        )}
      />

      {/* Create modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Experience"
      >
        <EntityForm
          fields={formFields}
          schema={experienceSchema}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          submitLabel="Create"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingExperience}
        onClose={() => setEditingExperience(null)}
        title="Edit Experience"
      >
        {editingExperience && (
          <EntityForm
            fields={formFields}
            schema={experienceSchema}
            defaultValues={editingExperience}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            submitLabel="Update"
            onCancel={() => setEditingExperience(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDeleteModal
        isOpen={!!deletingExperience}
        onClose={() => setDeletingExperience(null)}
        onConfirm={handleDelete}
        entityName={
          deletingExperience ? `${deletingExperience.role} at ${deletingExperience.company}` : ''
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
