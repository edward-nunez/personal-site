import { Link } from 'react-router-dom';
import { useProjects } from '@/core/api/queries';
import { SectionHeading, Skeleton } from '@/design-system/components';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects() {
  const { data: projects, isLoading, error } = useProjects({ featured: true });

  if (error) {
    return null; // Silently fail for featured section
  }

  return (
    <section className="section bg-bg-secondary">
      <div className="container-wide">
        <SectionHeading
          title="Featured Projects"
          subtitle="A selection of my recent work and side projects"
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors"
              >
                View All Projects
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-fg-muted">No featured projects yet.</p>
        )}
      </div>
    </section>
  );
}
