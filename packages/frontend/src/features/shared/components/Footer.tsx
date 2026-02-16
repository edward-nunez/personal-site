const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/edwardnunez', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/edwardnunez', external: true },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg" role="contentinfo">
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
        <p className="text-sm text-fg-muted">
          &copy; {currentYear} Edward Nunez. All rights reserved.
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6" role="list">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-fg-muted hover:text-fg transition-colors"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
