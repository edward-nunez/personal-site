import { Link } from 'react-router-dom';
import { Card } from '@/design-system/components';
import { formatDate } from '@/utils/formatting';
import type { BlogPost } from '@/types';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-semibold text-fg mb-6">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card hoverable className="h-full">
              <h3 className="text-lg font-semibold text-fg mb-2 line-clamp-2">{post.title}</h3>
              {post.excerpt && (
                <p className="text-sm text-fg-secondary line-clamp-2 mb-3">{post.excerpt}</p>
              )}
              <time className="text-xs text-fg-muted">
                {formatDate(post.publishedAt || post.createdAt)}
              </time>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
