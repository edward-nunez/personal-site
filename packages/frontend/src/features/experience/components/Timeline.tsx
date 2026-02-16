import type { Experience } from '@/types';
import { ExperienceCard } from './ExperienceCard';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-fg-muted">No experiences found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}
