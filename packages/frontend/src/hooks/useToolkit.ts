import { useQuery } from '@tanstack/react-query';
import type { ToolkitCategory } from '@/types';
import { fetchToolkitCategories } from '@/lib/toolkit-api';

const TOOLKIT_KEYS = {
  all: ['toolkit'] as const,
  categories: () => ['toolkit', 'categories'] as const,
};

/**
 * Fetch toolkit categories for the TOOL_KIT section (strong, moderate, gaps).
 */
export function useToolkit() {
  const query = useQuery({
    queryKey: TOOLKIT_KEYS.categories(),
    queryFn: fetchToolkitCategories,
  });
  return {
    ...query,
    categories: query.data ?? [],
  };
}
