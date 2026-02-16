import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminBlogPosts } from '@/core/api/queries';
import { useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '@/core/api/mutations';
import { DataTable, ConfirmDeleteModal, type Column } from '../components';
import { Button, Modal, Input, Textarea, Select } from '@/design-system/components';
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/types';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  readTime: z.number().optional().nullable(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

function BlogPostForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: {
  defaultValues?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData) => void | Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}) {
  // Convert ISO datetime to datetime-local format for editing
  const formDefaultValues = defaultValues
    ? {
        ...defaultValues,
        publishedAt: defaultValues.publishedAt
          ? new Date(defaultValues.publishedAt).toISOString().slice(0, 16)
          : undefined,
      }
    : {
        category: 'article',
        tags: [],
        published: false,
        featured: false,
      };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(blogPostSchema) as any,
    defaultValues: formDefaultValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- watch() from react-hook-form is intentionally used for auto-slug generation
  const title = watch('title');

  useEffect(() => {
    if (!defaultValues?.slug && title) {
      setValue('slug', generateSlug(title));
    }
  }, [title, defaultValues, setValue]);

  const handleFormSubmit = (data: BlogPostFormData) => {
    // Convert datetime-local format to ISO string with timezone
    const transformedData = {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : null,
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
                { value: 'tutorial', label: 'Tutorial' },
                { value: 'guide', label: 'Guide' },
                { value: 'article', label: 'Article' },
                { value: 'news', label: 'News' },
                { value: 'other', label: 'Other' },
              ]}
              error={errors.category?.message}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">
          Content <span className="text-error">*</span>
        </label>
        <Textarea {...register('content')} rows={12} error={errors.content?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Excerpt</label>
        <Textarea {...register('excerpt')} rows={3} error={errors.excerpt?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-2">Cover Image URL</label>
        <Input
          type="url"
          {...register('coverImage')}
          placeholder="https://..."
          error={errors.coverImage?.message}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-2">Published At</label>
          <Input
            type="datetime-local"
            {...register('publishedAt')}
            error={errors.publishedAt?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fg mb-2">Read Time (minutes)</label>
          <Input
            type="number"
            {...register('readTime', { valueAsNumber: true })}
            error={errors.readTime?.message}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('published')}
            className="h-4 w-4 rounded border-border text-accent"
          />
          <label className="text-sm text-fg-secondary">Published</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('featured')}
            className="h-4 w-4 rounded border-border text-accent"
          />
          <label className="text-sm text-fg-secondary">Featured</label>
        </div>
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

export function AdminBlogPage() {
  const { data: blogPosts, isLoading } = useAdminBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const handleTogglePublish = async (post: BlogPost) => {
    await updateMutation.mutateAsync({
      id: post.id,
      data: {
        published: !post.published,
        publishedAt: !post.published ? new Date().toISOString() : post.publishedAt,
      },
    });
  };

  const columns: Column<BlogPost>[] = [
    { header: 'Title', accessor: 'title', sortable: true },
    { header: 'Category', accessor: 'category', sortable: true },
    {
      header: 'Published',
      accessor: 'published',
      render: (value, row) => (
        <button
          onClick={() => handleTogglePublish(row)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value
              ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
              : 'bg-surface-hover text-fg-muted hover:bg-surface-hover/80'
          }`}
        >
          {value ? 'Published' : 'Draft'}
        </button>
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
    {
      header: 'Views',
      accessor: 'views',
      sortable: true,
    },
  ];

  const handleCreate = async (data: CreateBlogPostInput) => {
    await createMutation.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (data: UpdateBlogPostInput) => {
    if (!editingPost) return;
    await updateMutation.mutateAsync({ id: editingPost.id, data });
    setEditingPost(null);
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    await deleteMutation.mutateAsync(deletingPost.id);
    setDeletingPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg mb-2">Blog Management</h1>
          <p className="text-fg-secondary">Manage your blog posts</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <span className="mr-2">+</span>
          New Blog Post
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={blogPosts || []}
        isLoading={isLoading}
        rowKey="id"
        searchPlaceholder="Search blog posts..."
        actions={(row) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditingPost(row)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingPost(row)}
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
        title="Create New Blog Post"
      >
        <BlogPostForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!editingPost} onClose={() => setEditingPost(null)} title="Edit Blog Post">
        {editingPost && (
          <BlogPostForm
            defaultValues={editingPost}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditingPost(null)}
          />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDelete}
        entityName={deletingPost?.title || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
