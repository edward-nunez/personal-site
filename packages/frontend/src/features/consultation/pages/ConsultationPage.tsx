import { SectionHeading, Card, Badge } from '@/design-system/components';
import { ConsultationForm } from '../components';

const services = [
  {
    title: 'DevSecOps Consulting',
    description:
      'Security-first DevOps practices, compliance automation, and security tooling integration.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    title: 'Cloud Architecture',
    description: 'AWS, DigitalOcean, and multi-cloud infrastructure design and optimization.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
  {
    title: 'CI/CD Pipeline Setup',
    description: 'Automated testing, deployment pipelines, and GitOps workflows.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    title: 'Infrastructure as Code',
    description: 'Terraform, Kubernetes, and infrastructure automation solutions.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
];

export function ConsultationPage() {
  return (
    <main className="section">
      <div className="container-wide">
        <SectionHeading
          title="Request a Consultation"
          subtitle="Let's discuss how I can help with your DevSecOps and cloud infrastructure needs"
          align="center"
        />

        {/* Services Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service) => (
            <Card key={service.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent mb-4">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-fg mb-2">{service.title}</h3>
              <p className="text-sm text-fg-secondary">{service.description}</p>
            </Card>
          ))}
        </div>

        {/* Form and Info */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-[2fr_1fr] gap-8">
          {/* Consultation Form */}
          <Card>
            <h2 className="text-2xl font-semibold text-fg mb-6">Tell Me About Your Project</h2>
            <ConsultationForm />
          </Card>

          {/* Additional Info */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-fg mb-4">What to Expect</h3>
              <ul className="space-y-3 text-sm text-fg-secondary">
                <li className="flex gap-2">
                  <Badge variant="accent" className="mt-0.5">
                    1
                  </Badge>
                  <span>Submit your consultation request with project details</span>
                </li>
                <li className="flex gap-2">
                  <Badge variant="accent" className="mt-0.5">
                    2
                  </Badge>
                  <span>I&apos;ll review and respond within 24-48 hours</span>
                </li>
                <li className="flex gap-2">
                  <Badge variant="accent" className="mt-0.5">
                    3
                  </Badge>
                  <span>We&apos;ll schedule a free 30-minute discovery call</span>
                </li>
                <li className="flex gap-2">
                  <Badge variant="accent" className="mt-0.5">
                    4
                  </Badge>
                  <span>Receive a proposal with timeline and pricing</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-fg mb-4">Availability</h3>
              <p className="text-sm text-fg-secondary mb-4">
                I&apos;m currently accepting new consulting projects and full-time opportunities.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-success font-medium">Available for projects</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
