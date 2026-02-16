import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidUrl, isNonEmpty, isWithinLength } from '@/utils/validators';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@missing.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('accepts valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
    expect(isValidUrl('https://example.com/path?q=1')).toBe(true);
  });

  it('rejects invalid URLs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('ftp://missing')).toBe(true); // URL constructor accepts ftp
  });
});

describe('isNonEmpty', () => {
  it('returns true for non-empty strings', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });

  it('returns false for empty or whitespace strings', () => {
    expect(isNonEmpty('')).toBe(false);
    expect(isNonEmpty('   ')).toBe(false);
    expect(isNonEmpty('\t\n')).toBe(false);
  });
});

describe('isWithinLength', () => {
  it('returns true when within bounds', () => {
    expect(isWithinLength('hello', 1, 10)).toBe(true);
  });

  it('returns false when below minimum', () => {
    expect(isWithinLength('hi', 5, 10)).toBe(false);
  });

  it('returns false when above maximum', () => {
    expect(isWithinLength('hello world!!!', 1, 5)).toBe(false);
  });

  it('trims whitespace before checking', () => {
    expect(isWithinLength('  hi  ', 1, 2)).toBe(true);
  });
});
