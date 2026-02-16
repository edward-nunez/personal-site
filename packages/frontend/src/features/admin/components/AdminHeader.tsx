import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store';
import { useAdminUser } from '@/core/api/queries';
import { Button } from '@/design-system/components';
import { useThemeStore } from '@/core/store';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { data: user, isLoading } = useAdminUser();
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Center: Page title (mobile) or empty (desktop) */}
        <div className="flex-1 lg:hidden" />

        {/* Right: User info, theme toggle, logout */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
          </button>

          {/* User info */}
          {!isLoading && user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-surface-hover rounded-lg">
              <span className="text-xl">👤</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{user.username}</span>
                <span className="text-xs text-fg-muted">{user.email}</span>
              </div>
            </div>
          )}

          {/* Logout button */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
