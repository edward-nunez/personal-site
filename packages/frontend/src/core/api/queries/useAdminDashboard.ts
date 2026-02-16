import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../keys';
import { useAdminProjects } from './useAdminProjects';
import { useAdminBlogPosts } from './useAdminBlogPosts';
import { useAdminContacts } from './useAdminContacts';
import { useAdminConsultations } from './useAdminConsultations';

export interface DashboardStats {
  totalProjects: number;
  totalBlogPosts: number;
  totalContactSubmissions: number;
  totalConsultationSubmissions: number;
  unreadContacts: number;
  unreadConsultations: number;
}

export function useAdminDashboard() {
  const { data: projects } = useAdminProjects();
  const { data: blogPosts } = useAdminBlogPosts();
  const { data: contacts } = useAdminContacts();
  const { data: consultations } = useAdminConsultations();

  return useQuery({
    queryKey: queryKeys.admin.dashboard.stats,
    queryFn: async (): Promise<DashboardStats> => {
      return {
        totalProjects: projects?.length || 0,
        totalBlogPosts: blogPosts?.length || 0,
        totalContactSubmissions: contacts?.length || 0,
        totalConsultationSubmissions: consultations?.length || 0,
        unreadContacts: contacts?.filter((c) => !c.read).length || 0,
        unreadConsultations: consultations?.filter((c) => !c.read).length || 0,
      };
    },
    enabled: !!projects && !!blogPosts && !!contacts && !!consultations,
  });
}
