import { NavLink } from 'react-router-dom';
import { cn } from '@/utils';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/experience', label: 'Experience', icon: '💼' },
  { path: '/admin/projects', label: 'Projects', icon: '🚀' },
  { path: '/admin/blog', label: 'Blog', icon: '📝' },
  { path: '/admin/submissions', label: 'Submissions', icon: '📬' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-surface border-r border-border transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h1 className="text-xl font-bold text-fg">Admin Panel</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-fg-secondary hover:bg-surface-hover hover:text-fg'
                  )
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Back to Site */}
          <div className="p-4 border-t border-border">
            <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-fg-secondary hover:bg-surface-hover hover:text-fg transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">Back to Site</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
