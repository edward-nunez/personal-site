import type { ToolkitCategory } from '@/types';
import { apiGet } from './api';

const TOOLKIT_BASE = '/api/toolkit';

/**
 * Fetch all toolkit categories for the TOOL_KIT section (strong, moderate, gaps).
 */
export async function fetchToolkitCategories(): Promise<ToolkitCategory[]> {
  return apiGet<ToolkitCategory[]>(TOOLKIT_BASE);
}
