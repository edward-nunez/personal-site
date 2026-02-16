import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea, Select } from '@/design-system/components';

export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'checkbox' | 'number' | 'tags';

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  required?: boolean;
  defaultValue?: unknown;
}

interface EntityFormProps {
  fields: FieldDefinition[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void | Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function EntityForm({
  fields,
  schema,
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save',
  onCancel,
}: EntityFormProps) {
  // Convert ISO dates to date input format for editing
  const processedDefaultValues = defaultValues
    ? Object.entries(defaultValues).reduce(
        (acc, [key, value]) => {
          const field = fields.find((f) => f.name === key);
          if (field?.type === 'date' && value && typeof value === 'string') {
            // Convert ISO date to YYYY-MM-DD format
            acc[key] = new Date(value).toISOString().split('T')[0];
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, unknown>
      )
    : defaultValues;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // @ts-expect-error - Generic schema type compatibility
    resolver: zodResolver(schema),
    defaultValues: processedDefaultValues,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (data: any) => {
    // Convert date fields to ISO format before submitting
    const transformedData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const field = fields.find((f) => f.name === key);
        if (field?.type === 'date' && value && typeof value === 'string') {
          // Convert YYYY-MM-DD to ISO string
          acc[key] = new Date(value).toISOString();
        } else {
          acc[key] = value;
        }
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>
    );

    onSubmit(transformedData);
  };

  const renderField = (field: FieldDefinition) => {
    const error = errors[field.name]?.message as string | undefined;

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...register(field.name)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            error={error}
          />
        );

      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value as string}
                onChange={onChange}
                options={field.options || []}
                error={error}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register(field.name)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm text-fg-secondary">{field.label}</span>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            {...register(field.name)}
            placeholder={field.placeholder}
            error={error}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            {...register(field.name, { valueAsNumber: true })}
            placeholder={field.placeholder}
            error={error}
          />
        );

      case 'tags':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-2">
                <Input
                  placeholder={field.placeholder || 'Type and press Enter'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const newTag = input.value.trim();
                      if (newTag) {
                        const currentTags = (value as string[]) || [];
                        onChange([...currentTags, newTag]);
                        input.value = '';
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {((value as string[]) || []).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const currentTags = (value as string[]) || [];
                          onChange(currentTags.filter((_, i) => i !== index));
                        }}
                        className="hover:text-accent-hover"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {error && <p className="text-xs text-error">{error}</p>}
              </div>
            )}
          />
        );

      default:
        return (
          <Input
            type="text"
            {...register(field.name)}
            placeholder={field.placeholder}
            error={error}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          {field.type !== 'checkbox' && (
            <label htmlFor={field.name} className="block text-sm font-medium text-fg mb-2">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
          )}
          {renderField(field)}
        </div>
      ))}

      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
