import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPostBySlug, useBlogPosts } from '@/core/api/queries';
import { Skeleton } from '@/design-system/components';
import { BlogMetadata, BlogContent, TableOfContents, RelatedPosts } from '../components';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error, incrementViews } = useBlogPostBySlug(slug!);
  const { data: allPosts } = useBlogPosts({ published: true });

  // Increment view count on mount
  useEffect(() => {
    if (post && slug) {
      incrementViews.mutate(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, slug]);

  // Find related posts (same category or matching tags)
  const relatedPosts = useMemo(() => {
    if (!post || !allPosts) return [];

    return allPosts
      .filter((p) => p.id !== post.id)
      .filter((p) => {
        // Match by category or tags
        return p.category === post.category || p.tags.some((tag) => post.tags.includes(tag));
      })
      .slice(0, 3);
  }, [post, allPosts]);

  if (isLoading) {
    return (
      <main className="section">
        <div className="container-content">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="section">
        <div className="container-content text-center">
          <h1 className="text-3xl font-bold text-fg mb-4">Post Not Found</h1>
          <p className="text-fg-secondary mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container-wide">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg mb-8 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        <div className="grid lg:grid-cols-[1fr_250px] gap-12">
          {/* Main content */}
          <div>
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fg mb-6">
                {post.title}
              </h1>
              <BlogMetadata post={post} />
            </header>

            {/* Cover image */}
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-bg-tertiary mb-8">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <BlogContent content={post.content} />

            {/* Related posts */}
            <RelatedPosts posts={relatedPosts} />
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>
    </main>
  );
}
