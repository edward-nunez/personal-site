import { Badge } from '@/design-system/components';
import { formatDateRange } from '@/utils/formatting';
import type { Experience } from '@/types';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-accent ring-4 ring-bg" />

      {/* Timeline line */}
      <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-border last:hidden" />

      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-xl font-semibold text-fg">{experience.role}</h3>
              <p className="text-lg text-fg-secondary">{experience.company}</p>
            </div>
            {experience.featured && <Badge variant="accent">Featured</Badge>}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
            <time>{formatDateRange(experience.startDate, experience.endDate)}</time>
            {experience.location && (
              <>
                <span>•</span>
                <span>{experience.location}</span>
              </>
            )}
            {experience.employmentType && (
              <>
                <span>•</span>
                <span>{experience.employmentType}</span>
              </>
            )}
          </div>
        </div>

        {experience.description && (
          <p className="text-fg-secondary leading-relaxed">{experience.description}</p>
        )}

        {experience.achievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-fg mb-2">Key Achievements:</h4>
            <ul className="space-y-1">
              {experience.achievements.map((achievement, index) => (
                <li key={index} className="flex gap-2 text-sm text-fg-secondary">
                  <span className="text-accent mt-1">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(experience.skills.length > 0 || experience.technologies.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {[...experience.skills, ...experience.technologies].map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
