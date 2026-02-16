import { Badge } from '@/design-system/components';
import { formatDate } from '@/utils/formatting';
import type { BlogPost } from '@/types';

interface BlogMetadataProps {
  post: BlogPost;
}

export function BlogMetadata({ post }: BlogMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-fg-muted py-4 border-y border-border">
      <time dateTime={post.publishedAt || post.createdAt}>
        {formatDate(post.publishedAt || post.createdAt)}
      </time>

      {post.readTime && (
        <>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </>
      )}

      {post.views > 0 && (
        <>
          <span>•</span>
          <span>{post.views} views</span>
        </>
      )}

      <div className="ml-auto flex flex-wrap gap-2">
        <Badge variant="accent">{post.category}</Badge>
        {post.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
