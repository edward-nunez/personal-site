/**
 * Toolkit category for the TOOL_KIT section.
 * Exactly 3 records: strong, moderate, gaps; each has up to 5 items.
 */
export interface ToolkitCategory {
  id: string;
  slug: string; // 'strong' | 'moderate' | 'gaps'
  title: string;
  items: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
