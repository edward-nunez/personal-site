import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateContact } from '@/core/api/mutations';
import { Button, Input, Textarea } from '@/design-system/components';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const createContact = useCreateContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createContact.mutateAsync(data);
      reset();
    } catch {
      // Error is handled by the mutation hook (toast)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <Input
        label="Subject (Optional)"
        {...register('subject')}
        error={errors.subject?.message}
        placeholder="What is this about?"
        disabled={isSubmitting}
      />

      <Textarea
        label="Message"
        {...register('message')}
        error={errors.message?.message}
        placeholder="Tell me about your project, question, or just say hi..."
        rows={6}
        disabled={isSubmitting}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Send Message
      </Button>
    </form>
  );
}
