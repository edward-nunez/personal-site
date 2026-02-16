import { useEffect, useState, useMemo } from 'react';

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from markdown content using useMemo instead of effect
  const headings = useMemo(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));

    return matches.map((match) => {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return { id, text, level };
    });
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-2">
      <h3 className="text-sm font-semibold text-fg mb-4">Table of Contents</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                activeId === heading.id
                  ? 'text-accent font-medium'
                  : 'text-fg-secondary hover:text-fg'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
