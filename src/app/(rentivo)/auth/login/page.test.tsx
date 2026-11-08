import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Login from './page';
import { AuthService } from '@/src/services/AuthService';
import { saveTemporaryAuthTokens } from '@/src/utils/saveAuthTokens';
import { toast } from 'sonner';

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next/image', () => ({
  default: (props: React.ComponentProps<'img'>) => (
    <span data-testid="next-image" aria-label={props.alt} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.ComponentProps<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/src/services/AuthService', () => ({
  AuthService: {
    login: vi.fn(),
  },
}));

vi.mock('@/src/utils/saveAuthTokens', () => ({
  saveTemporaryAuthTokens: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('Login page', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login page', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', { name: 'Welcome Back!' })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('renders the navigation links', () => {
    render(<Login />);

    expect(screen.getByRole('link', { name: /back to home/i }))
      .toHaveAttribute('href', '/');

    expect(screen.getByRole('link', { name: /forgot password/i }))
      .toHaveAttribute('href', '/auth/forgot-password');

    expect(screen.getByRole('link', { name: /create account/i }))
      .toHaveAttribute('href', '/auth/register');
  });

  it('displays validation errors when submitted empty', async () => {
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText('Email address is required.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Password is required.')
    ).toBeInTheDocument();

    expect(AuthService.login).not.toHaveBeenCalled();
  });

  it('validates email independently', async () => {
    render(<Login />);

    await user.type(
      screen.getByLabelText('Password'),
      'Password123!'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText('Email address is required.')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Password is required.')
    ).not.toBeInTheDocument();
  });

  it('validates password independently', async () => {
    render(<Login />);

    await user.type(
      screen.getByLabelText('Email Address'),
      'test@example.com'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText('Password is required.')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Email address is required.')
    ).not.toBeInTheDocument();
  });

  it('clears an input validation error when the user types', async () => {
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText('Email address is required.')
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText('Email Address'),
      'test@example.com'
    );

    expect(
      screen.queryByText('Email address is required.')
    ).not.toBeInTheDocument();
  });

  it('submits valid credentials and redirects after successful login', async () => {
    const response = {
      status: 200,
      responseDateTime: new Date().toISOString(),
      statusDesc: 'Verification OTP sent',
      payload: {
        accessToken: 'temporary-access-token',
        refreshToken: 'temporary-refresh-token',
        expiresIn: 3600,
      },
    };

    vi.mocked(AuthService.login).mockResolvedValue(response);

    render(<Login />);

    await user.type(
      screen.getByLabelText('Email Address'),
      'test@example.com'
    );

    await user.type(
      screen.getByLabelText('Password'),
      'Password123!'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(saveTemporaryAuthTokens).toHaveBeenCalledWith(
        response.payload
      );

      expect(toast.success).toHaveBeenCalledWith(
        'Verification OTP sent'
      );

      expect(mockPush).toHaveBeenCalledWith('/auth/otp');
    });
  });

  it('does not redirect or save tokens when login fails', async () => {
    vi.mocked(AuthService.login).mockRejectedValue(
      new Error('Invalid credentials')
    );

    render(<Login />);

    await user.type(
      screen.getByLabelText('Email Address'),
      'test@example.com'
    );

    await user.type(
      screen.getByLabelText('Password'),
      'WrongPassword'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalled();
    });

    expect(saveTemporaryAuthTokens).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renders the Google login button', () => {
    render(<Login />);

    expect(
      screen.getByRole('button', { name: /continue with google/i })
    ).toBeInTheDocument();
  });
});