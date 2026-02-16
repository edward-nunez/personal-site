import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateConsultation } from '@/core/api/mutations';
import { Button, Input, Select, Textarea } from '@/design-system/components';

const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(200, 'Company name is too long').optional(),
  serviceType: z.string().min(1, 'Please select a service type'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z
    .string()
    .min(20, 'Please provide more details (at least 20 characters)')
    .max(2000, 'Description is too long'),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const serviceOptions = [
  { value: '', label: 'Select a service...' },
  { value: 'DevSecOps Consulting', label: 'DevSecOps Consulting' },
  { value: 'Cloud Architecture', label: 'Cloud Architecture' },
  { value: 'CI/CD Pipeline Setup', label: 'CI/CD Pipeline Setup' },
  { value: 'Infrastructure as Code', label: 'Infrastructure as Code' },
  { value: 'Security Automation', label: 'Security Automation' },
  { value: 'Full-Stack Development', label: 'Full-Stack Development' },
  { value: 'Other', label: 'Other' },
];

const budgetOptions = [
  { value: '', label: 'Select budget range...' },
  { value: 'Under $5k', label: 'Under $5k' },
  { value: '$5k - $10k', label: '$5k - $10k' },
  { value: '$10k - $25k', label: '$10k - $25k' },
  { value: '$25k - $50k', label: '$25k - $50k' },
  { value: '$50k+', label: '$50k+' },
  { value: 'Not sure', label: 'Not sure' },
];

const timelineOptions = [
  { value: '', label: 'Select timeline...' },
  { value: 'ASAP', label: 'ASAP' },
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '1 month', label: '1 month' },
  { value: '2-3 months', label: '2-3 months' },
  { value: '3+ months', label: '3+ months' },
  { value: 'Flexible', label: 'Flexible' },
];

export function ConsultationForm() {
  const createConsultation = useCreateConsultation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      await createConsultation.mutateAsync(data);
      reset();
    } catch {
      // Error is handled by the mutation hook (toast)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Your name"
          disabled={isSubmitting}
        />

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Company (Optional)"
        {...register('company')}
        error={errors.company?.message}
        placeholder="Your company or organization"
        disabled={isSubmitting}
      />

      <Select
        label="Service Type"
        {...register('serviceType')}
        error={errors.serviceType?.message}
        options={serviceOptions}
        disabled={isSubmitting}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Select
          label="Budget Range (Optional)"
          {...register('budget')}
          error={errors.budget?.message}
          options={budgetOptions}
          disabled={isSubmitting}
        />

        <Select
          label="Timeline (Optional)"
          {...register('timeline')}
          error={errors.timeline?.message}
          options={timelineOptions}
          disabled={isSubmitting}
        />
      </div>

      <Textarea
        label="Project Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Tell me about your project, goals, challenges, and what you're looking to achieve..."
        rows={6}
        disabled={isSubmitting}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Submit Consultation Request
      </Button>
    </form>
  );
}
