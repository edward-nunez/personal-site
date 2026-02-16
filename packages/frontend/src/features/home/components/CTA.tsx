import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="section bg-bg-secondary">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg text-fg-secondary mb-8">
            Looking for a DevSecOps engineer or need help with your cloud infrastructure? I&apos;m
            available for consulting and full-time opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/consultation"
              className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all duration-fast shadow-xs focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Request Consultation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-lg bg-bg-elevated text-fg border border-border hover:border-border-hover hover:bg-bg-hover transition-all duration-fast focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
