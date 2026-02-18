import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { ThemeProvider } from './ThemeProvider';

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </ThemeProvider>
  );
}

describe('Navbar', () => {
  it('renders nav element', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    );
    expect(document.querySelector('nav')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    );
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
    expect(screen.getByText('CONTACT')).toBeInTheDocument();
  });
});
