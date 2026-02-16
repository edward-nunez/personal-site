import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-orange/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,94,91,0.1),transparent_50%)]" />
      </div>

      <div className="container-wide">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Hi, I&apos;m <span className="text-gradient">Edward Nunez</span>
          </h1>

          <p className="text-xl md:text-2xl text-fg-secondary mb-8 leading-relaxed">
            DevSecOps Engineer & Full-Stack Developer specializing in cloud infrastructure, security
            automation, and building scalable applications.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all duration-fast shadow-xs focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Get in Touch
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-lg bg-bg-elevated text-fg border border-border hover:border-border-hover hover:bg-bg-hover transition-all duration-fast focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
