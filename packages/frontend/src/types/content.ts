/**
 * Content block types for project and blog body content.
 * Used by frontend display types; backend may support structured content later.
 */

export interface ProjectContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'blockquote' | 'list';
  text: string;
  language?: string;
  items?: string[];
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'blockquote';
  text: string;
  language?: string;
}
