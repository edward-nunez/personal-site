import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/core/api/queries';
import { SectionHeading, Skeleton } from '@/design-system/components';
import { BlogPostCard } from './BlogPostCard';

export function RecentBlogPosts() {
  const { data: posts, isLoading, error } = useBlogPosts({ published: true, limit: 3 });

  if (error) {
    return null; // Silently fail for featured section
  }

  return (
    <section className="section">
      <div className="container-wide">
        <SectionHeading
          title="Recent Blog Posts"
          subtitle="Thoughts on DevSecOps, cloud architecture, and software development"
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors"
              >
                View All Posts
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-fg-muted">No blog posts yet.</p>
        )}
      </div>
    </section>
  );
}
