/**
 * Format a date as "Jan 15, 2025"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date range as "Jan 2022 - Present" or "Jan 2022 - Dec 2024"
 */
export function formatDateRange(start: string | Date, end?: string | Date | null): string {
  const startStr = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (!end) return `${startStr} — Present`;
  const endStr = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${startStr} — ${endStr}`;
}

/**
 * Estimate reading time for text content
 */
export function estimateReadTime(text: string, wordsPerMinute = 200): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Slugify a string (for URLs)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
