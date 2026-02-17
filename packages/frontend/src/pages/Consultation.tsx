import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Shield, Cloud, GitBranch, FileCode } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { CreateConsultationSubmissionRequest } from '@/types';
import { submitConsultation } from '@/lib/submissions-api';

const consultationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Invalid email address').max(200),
  company: z.string().trim().max(200).nullable().optional().default(''),
  serviceType: z.string().min(1, 'Please select a service').max(200),
  budget: z.string().min(1, 'Please select a budget range').max(100),
  timeline: z.string().min(1, 'Please select a timeline').max(200),
  description: z.string().trim().min(1, 'Project description is required').max(5000),
});

const emptyForm: CreateConsultationSubmissionRequest = {
  name: '',
  email: '',
  company: '',
  serviceType: '',
  budget: '',
  timeline: '',
  description: '',
};

const services = [
  {
    icon: Shield,
    title: 'DevSecOps',
    description:
      'Security-first CI/CD pipelines, vulnerability scanning, and compliance automation.',
  },
  {
    icon: Cloud,
    title: 'Cloud Architecture',
    description:
      'Scalable, resilient cloud infrastructure on AWS, GCP, or Azure with cost optimization.',
  },
  {
    icon: GitBranch,
    title: 'CI/CD Pipelines',
    description: 'Automated build, test, and deploy workflows that ship code fast and safely.',
  },
  {
    icon: FileCode,
    title: 'Infrastructure as Code',
    description: 'Terraform, Pulumi, and CloudFormation modules for reproducible environments.',
  },
];

const steps = [
  { num: '01', title: 'Submit Request', desc: 'Fill out the form with your project details.' },
  { num: '02', title: 'Review (24-48h)', desc: "I'll review your request and assess fit." },
  { num: '03', title: 'Discovery Call', desc: '30-minute call to align on scope and goals.' },
  { num: '04', title: 'Proposal', desc: 'Detailed proposal with timeline and investment.' },
];

const budgetOptions = ['< $5K', '$5K – $15K', '$15K – $50K', '$50K+', 'Not sure yet'];
const timelineOptions = ['ASAP', '1–2 months', '3–6 months', '6+ months', 'Flexible'];

const inputClass =
  'w-full bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none';
const selectClass =
  'w-full bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground focus:outline-none appearance-none cursor-pointer';

const Consultation = () => {
  const [form, setForm] = useState<CreateConsultationSubmissionRequest>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateConsultationSubmissionRequest, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateConsultationSubmissionRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const openMailtoFallback = (data: CreateConsultationSubmissionRequest) => {
    const subject = encodeURIComponent(`Consultation Request: ${data.serviceType}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'N/A'}\nService: ${data.serviceType}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\nProject Description:\n${data.description}`
    );
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const handleSubmit = async () => {
    const result = consultationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateConsultationSubmissionRequest, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateConsultationSubmissionRequest;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitConsultation(result.data);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to send. Try again or use email.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
              // Service Request
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              REQUEST<span className="text-accent">_</span>CONSULTATION
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Need help building resilient infrastructure, hardening your pipelines, or migrating to
              the cloud? Let's scope it out.
            </p>
          </motion.div>

          {/* Service Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            {services.map((s) => (
              <div
                key={s.title}
                className="manga-panel bg-card p-6 hover:manga-shadow-sm transition-all duration-200 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]"
              >
                <s.icon className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-mono text-sm font-bold tracking-wider mb-2">
                  {s.title.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Form + Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form */}
            <div className="lg:col-span-2 manga-panel-thick bg-card p-6 md:p-8">
              {submitted ? (
                <div className="text-center space-y-4 py-12">
                  <span className="text-4xl">✓</span>
                  <p className="font-mono text-sm font-bold">REQUEST RECEIVED</p>
                  <p className="text-sm text-muted-foreground">
                    Thanks for your interest. I&apos;ll review your request and get back within
                    24–48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setForm(emptyForm);
                      setErrors({});
                      setSubmitted(false);
                      setSubmitError(null);
                    }}
                    className="manga-panel bg-accent text-accent-foreground px-6 py-2 font-mono text-xs font-bold tracking-wider hover:manga-shadow-accent hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-150"
                  >
                    SUBMIT_ANOTHER( )
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-mono text-sm font-bold tracking-wider mb-6">
                    TELL_ME_ABOUT<span className="text-accent">_</span>YOUR_PROJECT
                  </h2>

                  <div className="space-y-4">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-muted-foreground tracking-wider">
                          NAME
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Your name"
                          maxLength={100}
                          className={inputClass}
                        />
                        {errors.name && (
                          <p className="font-mono text-xs text-destructive">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-muted-foreground tracking-wider">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="you@example.com"
                          maxLength={255}
                          className={inputClass}
                        />
                        {errors.email && (
                          <p className="font-mono text-xs text-destructive">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-1">
                      <label className="font-mono text-xs text-muted-foreground tracking-wider">
                        COMPANY <span className="text-muted-foreground/60">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Your company"
                        maxLength={100}
                        className={inputClass}
                      />
                    </div>

                    {/* Service Type */}
                    <div className="space-y-1">
                      <label className="font-mono text-xs text-muted-foreground tracking-wider">
                        SERVICE_TYPE
                      </label>
                      <select
                        value={form.serviceType}
                        onChange={(e) => handleChange('serviceType', e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select a service...</option>
                        {services.map((s) => (
                          <option key={s.title} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      {errors.serviceType && (
                        <p className="font-mono text-xs text-destructive">{errors.serviceType}</p>
                      )}
                    </div>

                    {/* Budget + Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-muted-foreground tracking-wider">
                          BUDGET
                        </label>
                        <select
                          value={form.budget}
                          onChange={(e) => handleChange('budget', e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select range...</option>
                          {budgetOptions.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        {errors.budget && (
                          <p className="font-mono text-xs text-destructive">{errors.budget}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-muted-foreground tracking-wider">
                          TIMELINE
                        </label>
                        <select
                          value={form.timeline}
                          onChange={(e) => handleChange('timeline', e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select timeline...</option>
                          {timelineOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        {errors.timeline && (
                          <p className="font-mono text-xs text-destructive">{errors.timeline}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="font-mono text-xs text-muted-foreground tracking-wider">
                        PROJECT_DESCRIPTION
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Tell me about your project, goals, and current pain points..."
                        maxLength={5000}
                        rows={6}
                        className={`${inputClass} resize-none`}
                      />
                      <div className="flex justify-between">
                        {errors.description ? (
                          <p className="font-mono text-xs text-destructive">{errors.description}</p>
                        ) : (
                          <span />
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {form.description.length}/5000
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-6 space-y-2">
                    {submitError && (
                      <p className="font-mono text-xs text-destructive">{submitError}</p>
                    )}
                    <div className="flex justify-end gap-2">
                      {submitError && (
                        <button
                          type="button"
                          onClick={() => {
                            const result = consultationSchema.safeParse(form);
                            if (result.success) openMailtoFallback(result.data);
                          }}
                          className="manga-panel bg-card text-card-foreground px-6 py-3 font-mono text-sm font-bold tracking-wider hover:manga-shadow transition-all duration-150"
                        >
                          OPEN EMAIL INSTEAD
                        </button>
                      )}
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="manga-panel bg-accent text-accent-foreground px-8 py-3 font-mono text-sm font-bold tracking-wider hover:manga-shadow-accent hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {submitting ? 'SENDING…' : 'SUBMIT_REQUEST( )'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What to Expect */}
              <div className="manga-panel bg-card p-6">
                <h3 className="font-mono text-sm font-bold tracking-wider mb-4">
                  WHAT_TO<span className="text-accent">_</span>EXPECT
                </h3>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.num} className="flex gap-3">
                      <span className="font-mono text-xs text-accent font-bold mt-0.5">
                        {step.num}
                      </span>
                      <div>
                        <p className="font-mono text-xs font-bold">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="manga-panel bg-card p-6">
                <h3 className="font-mono text-sm font-bold tracking-wider mb-3">AVAILABILITY</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-green-500">AVAILABLE</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently accepting new consulting engagements. Response time is typically 24–48
                  hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consultation;
