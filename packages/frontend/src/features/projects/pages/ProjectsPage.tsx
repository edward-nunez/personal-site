import { useState, useMemo } from 'react';
import { useProjects } from '@/core/api/queries';
import { SectionHeading, Skeleton } from '@/design-system/components';
import { ProjectGrid } from '../components';

export function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!projects) return [];
    const cats = new Set(projects.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <main className="section">
      <div className="container-wide">
        <SectionHeading
          title="Projects"
          subtitle="A collection of my work, side projects, and experiments"
          align="center"
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-fg-secondary hover:bg-bg-hover hover:text-fg border border-border'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-error">Failed to load projects. Please try again later.</p>
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} />
        )}
      </div>
    </main>
  );
}
