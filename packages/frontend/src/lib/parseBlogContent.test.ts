import { describe, it, expect } from 'vitest';
import { parseBlogContent } from './parseBlogContent';

describe('parseBlogContent', () => {
  it('returns empty array for empty or whitespace content', () => {
    expect(parseBlogContent('')).toEqual([]);
    expect(parseBlogContent('   ')).toEqual([]);
  });

  it('parses JSON array of blocks', () => {
    const json = JSON.stringify([
      { type: 'heading', text: 'Title' },
      { type: 'paragraph', text: 'Hello world' },
    ]);
    const result = parseBlogContent(json);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'heading', text: 'Title' });
    expect(result[1]).toEqual({ type: 'paragraph', text: 'Hello world' });
  });

  it('converts simple markdown to blocks', () => {
    const md = '# Hello\n\nA paragraph.';
    const result = parseBlogContent(md);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].type).toBe('heading');
    expect(result[0].text).toBe('Hello');
  });

  it('falls back to single paragraph for plain text', () => {
    const result = parseBlogContent('Just some text');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('paragraph');
    expect(result[0].text).toBe('Just some text');
  });

  it('parses blockquote and heading from markdown', () => {
    const md = '> A quote\n\n## Subheading';
    const result = parseBlogContent(md);
    expect(result.some((b) => b.type === 'blockquote')).toBe(true);
    expect(result.some((b) => b.type === 'heading' && b.text === 'Subheading')).toBe(true);
  });

  it('parses invalid JSON as markdown', () => {
    const result = parseBlogContent('[ not valid json');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].type).toBe('paragraph');
  });
});
