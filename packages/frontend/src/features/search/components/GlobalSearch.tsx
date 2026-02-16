import { useEffect, useState, useMemo, useRef, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useUIStore } from '@/core/store';
import { useProjects, useExperiences, useBlogPosts } from '@/core/api/queries';
import { Modal, Badge } from '@/design-system/components';

type SearchResult = {
  type: 'project' | 'experience' | 'blog';
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
};

export function GlobalSearch() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const prevSearchOpenRef = useRef(isSearchOpen);

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
    return fuse.search(query).slice(0, 8);
  }, [query, fuse]);

  // Reset search state when modal closes
  useEffect(() => {
    if (prevSearchOpenRef.current && !isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
    prevSearchOpenRef.current = isSearchOpen;
  }, [isSearchOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].item.url);
      closeSearch();
    }
  };

  const handleResultClick = (url: string) => {
    navigate(url);
    closeSearch();
  };

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
    <Modal isOpen={isSearchOpen} onClose={closeSearch} size="md" title="Search">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="input-icon absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, blog posts, experience..."
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-bg-tertiary text-fg placeholder:text-fg-muted border border-border hover:border-border-hover focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            autoFocus
          />
        </div>

        {/* Results */}
        {query.trim() && results.length > 0 && (
          <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
            {results.map((result, index) => (
              <button
                key={result.item.id}
                onClick={() => handleResultClick(result.item.url)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-fast ${
                  index === selectedIndex
                    ? 'bg-accent/10 border border-accent'
                    : 'bg-bg-secondary border border-border hover:bg-bg-hover hover:border-border-hover'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Badge
                    variant={getTypeColor(result.item.type)}
                    className="mt-0.5 shrink-0 text-xs"
                  >
                    {result.item.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-fg mb-1 truncate">
                      {result.item.title}
                    </h4>
                    {result.item.description && (
                      <p className="text-xs text-fg-secondary line-clamp-2">
                        {result.item.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {query.trim() && results.length === 0 && (
          <div className="text-center py-10">
            <svg
              className="h-12 w-12 text-fg-faint mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-fg-secondary text-sm mb-1">No results found</p>
            <p className="text-fg-muted text-xs">Try different keywords</p>
          </div>
        )}

        {/* Empty State */}
        {!query.trim() && (
          <div className="text-center py-10">
            <svg
              className="h-10 w-10 text-fg-muted mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-fg-secondary text-sm">Start typing to search</p>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-fg-muted border-t border-border pt-3 mt-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-bg-secondary border border-border rounded font-mono">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-bg-secondary border border-border rounded font-mono">
              ↓
            </kbd>
            <span className="ml-0.5">navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-bg-secondary border border-border rounded font-mono">
              Enter
            </kbd>
            <span className="ml-0.5">select</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-bg-secondary border border-border rounded font-mono">
              Esc
            </kbd>
            <span className="ml-0.5">close</span>
          </span>
        </div>
      </div>
    </Modal>
  );
}
