import { Link } from 'react-router-dom';
import { Card, Badge } from '@/design-system/components';
import { formatDate } from '@/utils/formatting';
import type { BlogPost } from '@/types';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card hoverable className="h-full">
        {post.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-bg-tertiary mb-4">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <time dateTime={post.publishedAt || post.createdAt}>
              {formatDate(post.publishedAt || post.createdAt)}
            </time>
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-semibold text-fg line-clamp-2">{post.title}</h3>

          {post.excerpt && <p className="text-sm text-fg-secondary line-clamp-2">{post.excerpt}</p>}

          <div className="flex items-center gap-2">
            <Badge variant="accent">{post.category}</Badge>
            {post.views > 0 && <span className="text-xs text-fg-muted">{post.views} views</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
