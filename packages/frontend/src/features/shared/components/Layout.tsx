import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalSearch } from '@/features/search';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg overflow-x-hidden">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <GlobalSearch />
    </div>
  );
}
