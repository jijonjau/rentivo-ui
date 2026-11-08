import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('renders successfully', () => {
    const { container } = render(<PageLoader />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the loading spinner', () => {
    const { container } = render(<PageLoader />);

    const spinner = container.querySelector('.animate-spin');

    expect(spinner).toBeInTheDocument();
  });

  it('applies the expected spinner styling', () => {
    const { container } = render(<PageLoader />);

    const spinner = container.querySelector('.animate-spin');

    expect(spinner).toHaveClass(
      'h-10',
      'w-10',
      'rounded-full',
      'border-4',
      'animate-spin'
    );
  });

  it('centers the loader across the screen', () => {
    const { container } = render(<PageLoader />);

    expect(container.firstChild).toHaveClass(
      'min-h-screen',
      'flex',
      'items-center',
      'justify-center'
    );
  });
});
