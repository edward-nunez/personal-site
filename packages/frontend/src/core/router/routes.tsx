import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '@/features/shared/components/Layout';
import { Skeleton } from '@/design-system/components';

/* ─── Loading fallback ─── */
function PageLoader() {
  return (
    <main className="section">
      <div className="container-wide space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ─── Lazy-loaded pages ─── */
const HomePage = lazy(() => import('@/features/home').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/features/about').then((m) => ({ default: m.AboutPage })));
const ExperiencePage = lazy(() =>
  import('@/features/experience').then((m) => ({ default: m.ExperiencePage }))
);
const ProjectsPage = lazy(() =>
  import('@/features/projects').then((m) => ({ default: m.ProjectsPage }))
);
const ProjectDetailPage = lazy(() =>
  import('@/features/projects').then((m) => ({ default: m.ProjectDetailPage }))
);
const BlogListPage = lazy(() =>
  import('@/features/blog').then((m) => ({ default: m.BlogListPage }))
);
const BlogPostPage = lazy(() =>
  import('@/features/blog').then((m) => ({ default: m.BlogPostPage }))
);
const ContactPage = lazy(() =>
  import('@/features/contact').then((m) => ({ default: m.ContactPage }))
);
const ConsultationPage = lazy(() =>
  import('@/features/consultation').then((m) => ({ default: m.ConsultationPage }))
);
const SearchResultsPage = lazy(() =>
  import('@/features/search').then((m) => ({ default: m.SearchResultsPage }))
);

/* ─── Admin pages ─── */
const AdminLoginPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminExperiencePage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminExperiencePage }))
);
const AdminProjectsPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminProjectsPage }))
);
const AdminBlogPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminBlogPage }))
);
const AdminSubmissionsPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminSubmissionsPage }))
);
const AdminLayout = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminLayout }))
);

/* ─── Not Found ─── */
function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <p className="text-xl text-fg-secondary mb-8">Page not found</p>
        <a href="/" className="text-accent hover:text-accent-hover underline">
          Go back home
        </a>
      </div>
    </main>
  );
}

/* ─── Router configuration ─── */
export const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'consultation', element: <ConsultationPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: 'admin/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'experience', element: <AdminExperiencePage /> },
      { path: 'projects', element: <AdminProjectsPage /> },
      { path: 'blog', element: <AdminBlogPage /> },
      { path: 'submissions', element: <AdminSubmissionsPage /> },
    ],
  },
]);
