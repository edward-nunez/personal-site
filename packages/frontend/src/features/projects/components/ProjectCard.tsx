import { Link } from 'react-router-dom';
import { Card, Badge } from '@/design-system/components';
import { TechBadges } from './TechBadges';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <Card hoverable className="h-full">
        {project.images[0] && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-bg-tertiary mb-4">
            <img
              src={project.images[0]}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-fg">{project.title}</h3>
            <Badge variant="accent">{project.category}</Badge>
          </div>

          <p className="text-sm text-fg-secondary line-clamp-2">
            {project.shortDescription || project.description}
          </p>

          <TechBadges technologies={project.technologies} limit={4} />

          <div className="flex items-center gap-3 pt-2 text-sm text-fg-muted">
            {project.status && <span className="capitalize">{project.status}</span>}
            {project.githubUrl && (
              <>
                <span>•</span>
                <span>GitHub</span>
              </>
            )}
            {project.liveUrl && (
              <>
                <span>•</span>
                <span>Live Demo</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
