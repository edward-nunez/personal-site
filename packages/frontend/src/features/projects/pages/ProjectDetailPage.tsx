import { useParams, Link } from 'react-router-dom';
import { useProjectBySlug } from '@/core/api/queries';
import { Badge, Skeleton } from '@/design-system/components';
import { TechBadges, GodotEmbed, ProjectGallery } from '../components';
import { formatDateRange } from '@/utils/formatting';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProjectBySlug(slug!);

  if (isLoading) {
    return (
      <main className="section">
        <div className="container-content">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <Skeleton className="aspect-video w-full rounded-xl mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="section">
        <div className="container-content text-center">
          <h1 className="text-3xl font-bold text-fg mb-4">Project Not Found</h1>
          <p className="text-fg-secondary mb-8">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container-content">
        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg mb-8 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fg">
              {project.title}
            </h1>
            <Badge variant="accent">{project.category}</Badge>
          </div>

          {project.shortDescription && (
            <p className="text-xl text-fg-secondary mb-6">{project.shortDescription}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-fg-muted">
            {project.status && <span className="capitalize">{project.status}</span>}
            {(project.startDate || project.endDate) && (
              <>
                <span>•</span>
                <time>{formatDateRange(project.startDate!, project.endDate)}</time>
              </>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary border border-border hover:bg-bg-hover hover:border-border-hover text-fg transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Godot embed */}
        {project.godotWebExport && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-fg mb-4">Play Game</h2>
            <GodotEmbed url={project.godotWebExport} title={project.title} />
          </div>
        )}

        {/* Gallery */}
        {project.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-fg mb-4">Screenshots</h2>
            <ProjectGallery images={project.images} title={project.title} />
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-fg mb-4">About This Project</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-fg-secondary leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        </div>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-fg mb-4">Technologies Used</h2>
            <TechBadges technologies={project.technologies} />
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
