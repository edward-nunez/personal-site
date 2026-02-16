import type { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                border: '1px solid #262626',
                color: '#FAFAFA',
              },
            }}
          />
        </ThemeProvider>
      </QueryProvider>
    </HelmetProvider>
  );
}
