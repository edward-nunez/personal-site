import { Link } from 'react-router-dom';
import {
  useAdminProjects,
  useAdminBlogPosts,
  useAdminContacts,
  useAdminConsultations,
} from '@/core/api/queries';
import { StatsCard } from '../components';
import { Button, Skeleton } from '@/design-system/components';
import { useMemo } from 'react';
import type { ContactSubmission, ConsultationSubmission } from '@/types';

export function AdminDashboardPage() {
  const { data: projects, isLoading: projectsLoading } = useAdminProjects();
  const { data: blogPosts, isLoading: blogLoading } = useAdminBlogPosts();
  const { data: contacts, isLoading: contactsLoading } = useAdminContacts();
  const { data: consultations, isLoading: consultationsLoading } = useAdminConsultations();

  const isLoading = projectsLoading || blogLoading || contactsLoading || consultationsLoading;

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalProjects: projects?.length || 0,
      totalBlogPosts: blogPosts?.length || 0,
      totalContacts: contacts?.length || 0,
      totalConsultations: consultations?.length || 0,
      unreadContacts: contacts?.filter((c) => !c.read).length || 0,
      unreadConsultations: consultations?.filter((c) => !c.read).length || 0,
    };
  }, [projects, blogPosts, contacts, consultations]);

  // Get recent submissions (last 5)
  const recentSubmissions = useMemo(() => {
    const allSubmissions: Array<
      (ContactSubmission | ConsultationSubmission) & { type: 'contact' | 'consultation' }
    > = [
      ...(contacts?.map((c) => ({ ...c, type: 'contact' as const })) || []),
      ...(consultations?.map((c) => ({ ...c, type: 'consultation' as const })) || []),
    ];

    return allSubmissions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [contacts, consultations]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-fg mb-2">Dashboard</h1>
        <p className="text-fg-secondary">Welcome to your admin panel</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatsCard title="Total Projects" value={stats.totalProjects} icon="🚀" />
            <StatsCard title="Total Blog Posts" value={stats.totalBlogPosts} icon="📝" />
            <StatsCard title="Contact Submissions" value={stats.totalContacts} icon="📬" />
            <StatsCard title="Consultation Requests" value={stats.totalConsultations} icon="💼" />
          </>
        )}
      </div>

      {/* Unread submissions alert */}
      {(stats.unreadContacts > 0 || stats.unreadConsultations > 0) && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg mb-2">Unread Submissions</h3>
              <p className="text-fg-secondary">
                You have {stats.unreadContacts} unread contact
                {stats.unreadContacts !== 1 ? 's' : ''} and {stats.unreadConsultations} unread
                consultation
                {stats.unreadConsultations !== 1 ? 's' : ''}
              </p>
            </div>
            <Link to="/admin/submissions">
              <Button variant="primary" size="sm">
                View Submissions
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-fg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects">
            <Button variant="outline">
              <span className="mr-2">🚀</span>
              New Project
            </Button>
          </Link>
          <Link to="/admin/blog">
            <Button variant="outline">
              <span className="mr-2">📝</span>
              New Blog Post
            </Button>
          </Link>
          <Link to="/admin/experience">
            <Button variant="outline">
              <span className="mr-2">💼</span>
              Add Experience
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-fg mb-4">Recent Submissions</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : recentSubmissions.length === 0 ? (
          <p className="text-fg-secondary text-center py-8">No submissions yet</p>
        ) : (
          <div className="space-y-3">
            {recentSubmissions.map((submission) => (
              <div
                key={`${submission.type}-${submission.id}`}
                className="flex items-center justify-between p-4 bg-bg rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{submission.type === 'contact' ? '📬' : '💼'}</span>
                    <span className="font-medium text-fg">{submission.name}</span>
                    {!submission.read && (
                      <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-fg-secondary">{submission.email}</p>
                  <p className="text-xs text-fg-muted mt-1">
                    {new Date(submission.createdAt).toLocaleDateString()} at{' '}
                    {new Date(submission.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Link to="/admin/submissions">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
