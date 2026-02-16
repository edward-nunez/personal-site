import { Badge } from '@/design-system/components';

interface TechBadgesProps {
  technologies: string[];
  limit?: number;
}

export function TechBadges({ technologies, limit }: TechBadgesProps) {
  const displayTechs = limit ? technologies.slice(0, limit) : technologies;
  const remaining = limit && technologies.length > limit ? technologies.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTechs.map((tech) => (
        <Badge key={tech} variant="default">
          {tech}
        </Badge>
      ))}
      {remaining > 0 && <Badge variant="default">+{remaining}</Badge>}
    </div>
  );
}
