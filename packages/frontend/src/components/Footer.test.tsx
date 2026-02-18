import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Edward Nunez/)).toBeInTheDocument();
  });

  it('renders END_OF_FILE tag', () => {
    render(<Footer />);
    expect(screen.getByText('</END_OF_FILE>')).toBeInTheDocument();
  });

  it('renders as footer element', () => {
    render(<Footer />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
