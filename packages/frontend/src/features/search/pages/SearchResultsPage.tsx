import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useProjects, useExperiences, useBlogPosts } from '@/core/api/queries';
import { SectionHeading, Card, Badge } from '@/design-system/components';

type SearchResult = {
  type: 'project' | 'experience' | 'blog';
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
};

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filter, setFilter] = useState<'all' | 'project' | 'experience' | 'blog'>('all');

  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: blogPosts } = useBlogPosts({ published: true });

  const searchData = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    projects?.forEach((p) => {
      results.push({
        type: 'project',
        id: p.id,
        title: p.title,
        description: p.shortDescription || p.description,
        url: `/projects/${p.slug}`,
        category: p.category,
      });
    });

    experiences?.forEach((e) => {
      results.push({
        type: 'experience',
        id: e.id,
        title: `${e.role} at ${e.company}`,
        description: e.description || '',
        url: `/experience`,
      });
    });

    blogPosts?.forEach((b) => {
      results.push({
        type: 'blog',
        id: b.id,
        title: b.title,
        description: b.excerpt || '',
        url: `/blog/${b.slug}`,
        category: b.category,
      });
    });

    return results;
  }, [projects, experiences, blogPosts]);

  const fuse = useMemo(
    () =>
      new Fuse(searchData, {
        keys: ['title', 'description', 'category'],
        threshold: 0.3,
        includeScore: true,
      }),
    [searchData]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchResults = fuse.search(query);
    if (filter === 'all') return searchResults;
    return searchResults.filter((r) => r.item.type === filter);
  }, [query, filter, fuse]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'accent';
      case 'blog':
        return 'success';
      case 'experience':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <main className="section">
      <div className="container-wide">
        <SectionHeading
          title={`Search Results for "${query}"`}
          subtitle={`Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'project', 'blog', 'experience'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === type
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-fg-secondary hover:bg-bg-hover hover:text-fg border border-border'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <Link key={result.item.id} to={result.item.url}>
                <Card hoverable>
                  <div className="flex items-start gap-4">
                    <Badge variant={getTypeColor(result.item.type)} className="mt-1">
                      {result.item.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-fg mb-2">{result.item.title}</h3>
                      {result.item.description && (
                        <p className="text-sm text-fg-secondary line-clamp-2">
                          {result.item.description}
                        </p>
                      )}
                      {result.item.category && (
                        <Badge variant="default" className="mt-2">
                          {result.item.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-fg-muted mb-4">No results found for &quot;{query}&quot;</p>
            <Link to="/" className="text-accent hover:text-accent-hover underline">
              Go back home
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-fg-muted">Enter a search query to see results</p>
          </div>
        )}
      </div>
    </main>
  );
}
