import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  const statusCases = [
    ['Active', 'bg-emerald-100 text-emerald-700'],
    ['Success', 'bg-green-100 text-green-700'],
    ['Resolved', 'bg-teal-100 text-teal-700'],
    ['Pending', 'bg-amber-100 text-amber-700'],
    ['In Progress', 'bg-blue-100 text-blue-700'],
    ['Open', 'bg-orange-100 text-orange-700'],
    ['Failed', 'bg-rose-100 text-rose-700'],
    ['Rejected', 'bg-red-100 text-red-700'],
    ['Disabled', 'bg-slate-200 text-slate-700'],
  ];

  it.each(statusCases)(
    'displays %s with the correct styling',
    (status, expectedClasses) => {
      render(<StatusBadge status={status} />);

      const badge = screen.getByText(status);

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(...expectedClasses.split(' '));
    }
  );

  it('uses fallback styling for an unknown status', () => {
    render(<StatusBadge status="Unknown" />);

    const badge = screen.getByText('Unknown');

    expect(badge).toHaveClass('bg-slate-100', 'text-slate-600');
  });

  it('handles an empty status', () => {
    const { container } = render(<StatusBadge status="" />);

    const badge = container.querySelector('span');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('');
    expect(badge).toHaveClass('bg-slate-100', 'text-slate-600');
  });

  it('applies common badge styling', () => {
    render(<StatusBadge status="Active" />);

    expect(screen.getByText('Active')).toHaveClass(
      'rounded-full',
      'px-2.5',
      'py-1',
      'text-xs',
      'font-medium'
    );
  });
});
