import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PageHeader from './PageHeader';

const { mockBack } = vi.hoisted(() => ({
  mockBack: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('PageHeader', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('renders the title and description', () => {
    render(
      <PageHeader
        title="Dashboard"
        description="Manage your rental properties"
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Dashboard', level: 1 })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Manage your rental properties')
    ).toBeInTheDocument();
  });

  it('does not display the back button by default', () => {
    render(
      <PageHeader
        title="Dashboard"
        description="Manage your rental properties"
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Go back' })
    ).not.toBeInTheDocument();
  });

  it('displays the back button when showBackButton is true', () => {
    render(
      <PageHeader
        title="Edit Property"
        description="Update property details"
        showBackButton
      />
    );

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('navigates back when the back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <PageHeader
        title="Edit Property"
        description="Update property details"
        showBackButton
      />
    );

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
