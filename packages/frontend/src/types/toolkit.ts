/**
 * Toolkit category for the TOOL_KIT section.
 * Backend has exactly 3 records: strong, moderate, gaps; each has up to 5 items.
 */
export interface ToolkitCategory {
  id: string;
  slug: 'strong' | 'moderate' | 'gaps';
  title: string;
  items: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}
