import type { ContentBlock } from '@/types';

/**
 * Parse backend content string into ContentBlock[] for display.
 * - If content is JSON array of blocks, use it.
 * - Otherwise treat as plain text (single paragraph) or simple markdown.
 */
export function parseBlogContent(content: string): ContentBlock[] {
  if (!content?.trim()) return [];

  const trimmed = content.trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && parsed.every(isContentBlockLike)) {
        return parsed.map(normalizeBlock);
      }
    } catch {
      // fall through to plain/markdown
    }
  }

  return simpleMarkdownToBlocks(trimmed);
}

function isContentBlockLike(x: unknown): x is { type?: string; text?: string; language?: string } {
  return typeof x === 'object' && x !== null && 'type' in x && 'text' in x;
}

function normalizeBlock(x: { type?: string; text?: string; language?: string }): ContentBlock {
  const type = x.type ?? 'paragraph';
  const validType =
    type === 'heading' || type === 'paragraph' || type === 'code' || type === 'blockquote'
      ? type
      : 'paragraph';
  return {
    type: validType,
    text: String(x.text ?? ''),
    ...(x.language && { language: String(x.language) }),
  };
}

/**
 * Very simple markdown-like split: # lines -> heading, > lines -> blockquote, else paragraph.
 */
function simpleMarkdownToBlocks(md: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = md.split(/\n/);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', text: line.slice(2).trim() });
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', text: line.slice(3).trim() });
      i += 1;
      continue;
    }
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2).trim());
        i += 1;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i] !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('>')
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    if (paragraphLines.length) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join('\n').trim() });
    }
    if (i < lines.length && lines[i] === '') i += 1;
  }

  return blocks.length ? blocks : [{ type: 'paragraph', text: md }];
}
