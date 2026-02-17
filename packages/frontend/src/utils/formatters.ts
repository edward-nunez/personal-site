/**
 * Display formatters for derived fields (period, volume, chapter).
 * Aligns with plan: compute from backend data for UI.
 */

/**
 * Format start/end dates as "YYYY — Present" or "YYYY — YYYY".
 */
export function formatPeriod(startDate: Date | string, endDate?: Date | string | null): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const startYear = start.getFullYear();
  if (!endDate) return `${startYear} — Present`;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return `${startYear} — ${end.getFullYear()}`;
}

/**
 * Format index as volume label e.g. "Vol.01".
 */
export function formatVolume(index: number): string {
  const n = String(index + 1).padStart(2, '0');
  return `Vol.${n}`;
}

/**
 * Format index as chapter label e.g. "Ch.01".
 */
export function formatChapter(index: number): string {
  const n = String(index + 1).padStart(2, '0');
  return `Ch.${n}`;
}

/**
 * Map backend project status to display label for UI.
 */
export function projectStatusDisplay(
  status: 'completed' | 'in-progress' | 'archived'
): 'COMPLETE' | 'ONGOING' | 'ARCHIVED' {
  const map = {
    completed: 'COMPLETE' as const,
    'in-progress': 'ONGOING' as const,
    archived: 'ARCHIVED' as const,
  };
  return map[status];
}

/**
 * Format numeric read time (minutes) as display string e.g. "6 min".
 */
export function formatReadTime(minutes: number): string {
  return `${minutes} min`;
}
