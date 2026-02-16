import { useState, useMemo } from 'react';
import { useBlogPosts } from '@/core/api/queries';
import { SectionHeading, Skeleton, Pagination } from '@/design-system/components';
import { BlogPostCard } from '../components';

const POSTS_PER_PAGE = 9;

export function BlogListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: allPosts, isLoading, error } = useBlogPosts({ published: true });

  const categories = useMemo(() => {
    if (!allPosts) return [];
    const cats = new Set(allPosts.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (!allPosts) return [];
    if (selectedCategory === 'all') return allPosts;
    return allPosts.filter((p) => p.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <main className="section">
      <div className="container-wide">
        <SectionHeading
          title="Blog"
          subtitle="Thoughts on DevSecOps, cloud architecture, and software development"
          align="center"
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-fg-secondary hover:bg-bg-hover hover:text-fg border border-border'
              }`}
            >
              {category === 'all' ? 'All Posts' : category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
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
            <p className="text-error">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : paginatedPosts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {paginatedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-fg-muted">No blog posts found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
