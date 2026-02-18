import { describe, it, expect } from 'vitest';
import {
  formatPeriod,
  formatVolume,
  formatChapter,
  projectStatusDisplay,
  formatReadTime,
} from './formatters';

describe('formatPeriod', () => {
  it('returns "YYYY — Present" when no endDate', () => {
    expect(formatPeriod(new Date(2020, 0, 15))).toBe('2020 — Present');
    expect(formatPeriod(new Date(2022, 5, 15))).toBe('2022 — Present');
    expect(formatPeriod(new Date(2021, 0, 1), null)).toBe('2021 — Present');
  });

  it('returns "YYYY — YYYY" when endDate provided', () => {
    expect(formatPeriod(new Date(2020, 0, 15), new Date(2023, 11, 15))).toBe('2020 — 2023');
    expect(formatPeriod(new Date(2019, 0, 1), new Date(2021, 5, 1))).toBe('2019 — 2021');
  });
});

describe('formatVolume', () => {
  it('formats index as Vol.NN', () => {
    expect(formatVolume(0)).toBe('Vol.01');
    expect(formatVolume(9)).toBe('Vol.10');
  });
});

describe('formatChapter', () => {
  it('formats index as Ch.NN', () => {
    expect(formatChapter(0)).toBe('Ch.01');
    expect(formatChapter(4)).toBe('Ch.05');
  });
});

describe('projectStatusDisplay', () => {
  it('maps status to display label', () => {
    expect(projectStatusDisplay('completed')).toBe('COMPLETE');
    expect(projectStatusDisplay('in-progress')).toBe('ONGOING');
    expect(projectStatusDisplay('archived')).toBe('ARCHIVED');
  });
});

describe('formatReadTime', () => {
  it('formats minutes with "min"', () => {
    expect(formatReadTime(6)).toBe('6 min');
    expect(formatReadTime(1)).toBe('1 min');
  });
});
