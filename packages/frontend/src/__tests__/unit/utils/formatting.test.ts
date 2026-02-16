import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateRange,
  estimateReadTime,
  truncate,
  slugify,
} from '@/utils/formatting';

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    // Use ISO with time to avoid timezone-dependent day (e.g. 2025-01-15 UTC midnight = Jan 14 in some zones)
    const result = formatDate('2025-01-15T12:00:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('2025');
    expect(result).toMatch(/\b(14|15)\b/); // Day varies by timezone
  });

  it('formats a Date object correctly', () => {
    const result = formatDate(new Date(2025, 0, 15));
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });
});

describe('formatDateRange', () => {
  it('returns "Present" when no end date', () => {
    expect(formatDateRange('2022-01-01')).toContain('Present');
  });

  it('returns "Present" when end date is null', () => {
    expect(formatDateRange('2022-01-01', null)).toContain('Present');
  });

  it('formats a complete date range', () => {
    // Use ISO with time to avoid timezone shifting month (e.g. 2022-01-01 UTC midnight = Dec 2021 in some zones)
    const result = formatDateRange('2022-01-15T12:00:00Z', '2024-06-15T12:00:00Z');
    expect(result).toContain('Jan 2022');
    expect(result).toContain('Jun 2024');
  });
});

describe('estimateReadTime', () => {
  it('returns at least 1 minute for short text', () => {
    expect(estimateReadTime('hello world')).toBe(1);
  });

  it('estimates correctly for longer text', () => {
    const words = Array(400).fill('word').join(' ');
    expect(estimateReadTime(words)).toBe(2);
  });

  it('supports custom words per minute', () => {
    const words = Array(300).fill('word').join(' ');
    expect(estimateReadTime(words, 100)).toBe(3);
  });
});

describe('truncate', () => {
  it('returns original text if under limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ellipsis', () => {
    expect(truncate('hello world', 7)).toBe('hello w...');
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('slugify', () => {
  it('converts to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('handles multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });
});
