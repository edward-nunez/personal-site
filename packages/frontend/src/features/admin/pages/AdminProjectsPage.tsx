import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminProjects } from '@/core/api/queries';
import { useCreateProject, useUpdateProject, useDeleteProject } from '@/core/api/mutations';
import { DataTable, ConfirmDeleteModal, type Column } from '../components';
import { Button, Modal, Input, Textarea, Select } from '@/design-system/components';
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional().nullable(),
  technologies: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  githubUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  godotWebExport: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.string().default('completed'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  order: z.number().default(0),
});

type ProjectFormData = z.infer<typeof projectSchema>;

// Helper to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

function ProjectForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: {
  defaultValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void | Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}) {
  // Convert ISO datetime to date format for editing
  const formDefaultValues = defaultValues
    ? {
        ...defaultValues,
        startDate: defaultValues.startDate
          ? new Date(defaultValues.startDate).toISOString().split('T')[0]
          : undefined,
        endDate: defaultValues.endDate
          ? new Date(defaultValues.endDate).toISOString().split('T')[0]
          : undefined,
      }
    : {
        category: 'web',
        status: 'completed',
        technologies: [],
        tags: [],
        images: [],
        featured: false,
        order: 0,
      };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectSchema) as any,
    defaultValues: formDefaultValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- watch() from react-hook-form is intentionally used for auto-slug generation
  const title = watch('title');

  // Auto-generate slug from title (only for new projects)
  useEffect(() => {
    if (!defaultValues?.slug && title) {
      setValue('slug', generateSlug(title));
    }
  }, [title, defaultValues, setValue]);

  const handleFormSubmit = (data: ProjectFormData) => {
    // Convert date format to ISO string with timezone
    const transformedData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-fg mb-2">
          Title <span className="text-error">*</span>
        </label>
        <Input {...register('title')} error={errors.title?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">
          Slug <span className="text-error">*</span>
        </label>
        <Input {...register('slug')} error={errors.slug?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">
          Category <span className="text-error">*</span>
        </label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 'web', label: 'Web Development' },
                { value: 'mobile', label: 'Mobile App' },
                { value: 'game', label: 'Game Development' },
                { value: 'tool', label: 'Tool/Utility' },
                { value: 'other', label: 'Other' },
              ]}
              error={errors.category?.message}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 'completed', label: 'Completed' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'planned', label: 'Planned' },
              ]}
              error={errors.status?.message}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">
          Description <span className="text-error">*</span>
        </label>
        <Textarea {...register('description')} rows={4} error={errors.description?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Short Description</label>
        <Textarea
          {...register('shortDescription')}
          rows={2}
          error={errors.shortDescription?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-2">Start Date</label>
          <Input type="date" {...register('startDate')} error={errors.startDate?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-fg mb-2">End Date</label>
          <Input type="date" {...register('endDate')} error={errors.endDate?.message} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">GitHub URL</label>
        <Input
          type="url"
          {...register('githubUrl')}
          placeholder="https://github.com/..."
          error={errors.githubUrl?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Live URL</label>
        <Input
          type="url"
          {...register('liveUrl')}
          placeholder="https://..."
          error={errors.liveUrl?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Godot Web Export URL</label>
        <Input
          type="url"
          {...register('godotWebExport')}
          placeholder="https://..."
          error={errors.godotWebExport?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Technologies</label>
        <Controller
          name="technologies"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-2">
              <Input
                placeholder="Type and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const newTag = input.value.trim();
                    if (newTag) {
                      onChange([...(value || []), newTag]);
                      input.value = '';
                    }
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {(value || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => onChange((value || []).filter((_, i) => i !== index))}
                      className="hover:text-accent-hover"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Tags</label>
        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-2">
              <Input
                placeholder="Type and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const newTag = input.value.trim();
                    if (newTag) {
                      onChange([...(value || []), newTag]);
                      input.value = '';
                    }
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {(value || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => onChange((value || []).filter((_, i) => i !== index))}
                      className="hover:text-accent-hover"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('featured')}
          className="h-4 w-4 rounded border-border text-accent"
        />
        <label className="text-sm text-fg-secondary">Featured</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Display Order</label>
        <Input
          type="number"
          {...register('order', { valueAsNumber: true })}
          error={errors.order?.message}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
}

export function AdminProjectsPage() {
  const { data: projects, isLoading } = useAdminProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const columns: Column<Project>[] = [
    { header: 'Title', accessor: 'title', sortable: true },
    { header: 'Category', accessor: 'category', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-surface-hover text-fg capitalize">
          {value as string}
        </span>
      ),
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

  const handleCreate = async (data: CreateProjectInput) => {
    await createMutation.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (data: UpdateProjectInput) => {
    if (!editingProject) return;
    await updateMutation.mutateAsync({ id: editingProject.id, data });
    setEditingProject(null);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    await deleteMutation.mutateAsync(deletingProject.id);
    setDeletingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg mb-2">Projects Management</h1>
          <p className="text-fg-secondary">Manage your portfolio projects</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <span className="mr-2">+</span>
          Add Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects || []}
        isLoading={isLoading}
        rowKey="id"
        searchPlaceholder="Search projects..."
        actions={(row) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditingProject(row)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingProject(row)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Project"
      >
        <ProjectForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
        {editingProject && (
          <ProjectForm
            defaultValues={editingProject}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDelete}
        entityName={deletingProject?.title || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
