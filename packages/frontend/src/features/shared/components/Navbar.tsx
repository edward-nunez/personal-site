import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '@/core/store';
import { useThemeStore } from '@/core/store';
import { cn } from '@/utils/cn';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const location = useLocation();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } = useUIStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav
        className="container-wide flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-fg hover:text-accent transition-colors"
          onClick={closeMobileMenu}
        >
          EN<span className="text-accent">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  location.pathname === link.href
                    ? 'text-fg bg-bg-hover'
                    : 'text-fg-secondary hover:text-fg hover:bg-bg-hover'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={toggleSearch}
            className="flex items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:text-fg rounded-lg hover:bg-bg-hover transition-colors"
            aria-label="Search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs text-fg-muted">⌘K</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-fg-secondary hover:text-fg rounded-lg hover:bg-bg-hover transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-fg-secondary hover:text-fg rounded-lg hover:bg-bg-hover transition-colors"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-bg">
          <ul className="flex flex-col p-4 gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname === link.href
                      ? 'text-fg bg-bg-hover'
                      : 'text-fg-secondary hover:text-fg hover:bg-bg-hover'
                  )}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Mobile actions */}
            <li className="border-t border-border pt-3 mt-2">
              <button
                onClick={() => {
                  toggleSearch();
                  closeMobileMenu();
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-fg-secondary hover:text-fg hover:bg-bg-hover rounded-lg transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-fg-secondary hover:text-fg hover:bg-bg-hover rounded-lg transition-colors"
              >
                {isDark ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
