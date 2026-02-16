import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <article className="prose dark:prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize rendering for better styling
          h1: ({ node: _node, ...props }) => (
            <h1 className="text-4xl font-bold tracking-tight text-fg mb-4" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2 className="text-3xl font-bold tracking-tight text-fg mt-12 mb-4" {...props} />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3 className="text-2xl font-semibold text-fg mt-8 mb-3" {...props} />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="text-fg-secondary leading-relaxed mb-4" {...props} />
          ),
          a: ({ node: _node, ...props }) => (
            <a
              className="text-accent hover:text-accent-hover underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          code: ({
            node: _node,
            inline,
            ...props
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }: any) =>
            inline ? (
              <code
                className="px-1.5 py-0.5 rounded bg-bg-tertiary text-accent font-mono text-sm"
                {...props}
              />
            ) : (
              <code
                className="block p-4 rounded-lg bg-bg-tertiary text-fg font-mono text-sm overflow-x-auto"
                {...props}
              />
            ),
          pre: ({ node: _node, ...props }) => (
            <pre className="my-6 rounded-lg bg-bg-tertiary overflow-x-auto" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 text-fg-secondary mb-4" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 text-fg-secondary mb-4" {...props} />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="border-l-4 border-accent pl-4 italic text-fg-secondary my-6"
              {...props}
            />
          ),
          table: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-border" {...props} />
            </div>
          ),
          th: ({ node: _node, ...props }) => (
            <th className="border border-border bg-bg-secondary px-4 py-2 text-left" {...props} />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
