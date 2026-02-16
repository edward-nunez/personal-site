import { useState, useMemo } from 'react';
import { useExperiences } from '@/core/api/queries';
import { SectionHeading, Skeleton } from '@/design-system/components';
import { Timeline, FilterBar } from '../components';

export function ExperiencePage() {
  const {
    data: experiences,
    isLoading,
    error,
  } = useExperiences({ orderBy: 'startDate', orderDirection: 'desc' });
  const [filter, setFilter] = useState('');

  const filteredExperiences = useMemo(() => {
    if (!experiences || !filter) return experiences || [];

    const lowerFilter = filter.toLowerCase();
    return experiences.filter((exp) => {
      return (
        exp.company.toLowerCase().includes(lowerFilter) ||
        exp.role.toLowerCase().includes(lowerFilter) ||
        exp.skills.some((skill) => skill.toLowerCase().includes(lowerFilter)) ||
        exp.technologies.some((tech) => tech.toLowerCase().includes(lowerFilter))
      );
    });
  }, [experiences, filter]);

  return (
    <main className="section">
      <div className="container-wide">
        <SectionHeading
          title="Professional Experience"
          subtitle="My journey through various roles in software development and DevSecOps"
          align="center"
        />

        <div className="max-w-4xl mx-auto">
          <FilterBar onFilterChange={setFilter} />

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-error">Failed to load experiences. Please try again later.</p>
            </div>
          ) : (
            <Timeline experiences={filteredExperiences} />
          )}
        </div>
      </div>
    </main>
  );
}
