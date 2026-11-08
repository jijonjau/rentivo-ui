import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormInput from './FormInput';

describe('FormInput', () => {
  describe('Rendering', () => {
    it('renders the input with its label and placeholder', () => {
      render(
        <FormInput
          id="email"
          label="Email address"
          placeholder="Enter your email"
        />
      );

      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your email')
      ).toBeInTheDocument();
    });

    it('renders without an optional label', () => {
      render(<FormInput id="email" placeholder="Enter your email" />);

      expect(
        screen.getByPlaceholderText('Enter your email')
      ).toBeInTheDocument();
      expect(screen.queryByText('Email address')).not.toBeInTheDocument();
    });

    it('renders the label action when supplied', () => {
      render(
        <FormInput
          id="password"
          label="Password"
          labelAction={<button type="button">Forgot password?</button>}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Forgot password?' })
      ).toBeInTheDocument();
    });

    it('renders a left icon when supplied', () => {
      render(
        <FormInput
          id="email"
          leftIcon={<span data-testid="left-icon">@</span>}
        />
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders a right icon for a non-password input', () => {
      render(
        <FormInput
          id="email"
          rightIcon={<span data-testid="right-icon">Search</span>}
        />
      );

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('applies a custom class name', () => {
      render(<FormInput id="email" className="custom-input" />);

      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });
  });

  describe('Input properties', () => {
    it('forwards native input properties', () => {
      render(
        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          defaultValue="user@example.com"
          required
        />
      );

      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('name', 'email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter email');
      expect(input).toHaveValue('user@example.com');
      expect(input).toBeRequired();
    });

    it('supports disabled inputs', () => {
      render(<FormInput id="email" disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('supports input changes', async () => {
      const user = userEvent.setup();

      render(<FormInput id="email" placeholder="Enter email" />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'user@example.com');

      expect(input).toHaveValue('user@example.com');
    });

    it('uses text as the default input type', () => {
      render(<FormInput id="name" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });
  });

  describe('Password visibility', () => {
    it('renders a password input with a show-password button', () => {
      render(<FormInput id="password" label="Password" type="password" />);

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password'
      );

      expect(
        screen.getByRole('button', { name: 'Show password' })
      ).toBeInTheDocument();
    });

    it('shows the password when the visibility button is clicked', async () => {
      const user = userEvent.setup();

      render(<FormInput id="password" type="password" />);

      const input = document.getElementById('password') as HTMLInputElement;

      await user.click(screen.getByRole('button', { name: 'Show password' }));

      expect(input).toHaveAttribute('type', 'text');

      expect(
        screen.getByRole('button', { name: 'Hide password' })
      ).toBeInTheDocument();
    });

    it('hides the password again when the visibility button is clicked', async () => {
      const user = userEvent.setup();

      render(<FormInput id="password" type="password" />);

      await user.click(screen.getByRole('button', { name: 'Show password' }));

      await user.click(screen.getByRole('button', { name: 'Hide password' }));

      const input = document.getElementById('password') as HTMLInputElement;

      expect(input).toHaveAttribute('type', 'password');

      expect(
        screen.getByRole('button', { name: 'Show password' })
      ).toBeInTheDocument();
    });

    it('does not render the password toggle for other input types', () => {
      render(
        <FormInput id="email" type="email" rightIcon={<span>Search</span>} />
      );

      expect(
        screen.queryByRole('button', { name: 'Show password' })
      ).not.toBeInTheDocument();

      expect(screen.getByText('Search')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('displays the error message and accessibility attributes', () => {
      render(<FormInput id="email" label="Email" error="Email is required" />);

      const input = screen.getByLabelText('Email');

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(document.getElementById('email-error')).toBeInTheDocument();
    });

    it('does not set error accessibility attributes when there is no error', () => {
      render(<FormInput id="email" label="Email" />);

      const input = screen.getByLabelText('Email');

      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('applies error styling when an error is supplied', () => {
      render(<FormInput id="email" error="Invalid email" />);

      expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    it('applies normal styling when there is no error', () => {
      render(<FormInput id="email" />);

      expect(screen.getByRole('textbox')).toHaveClass(
        'border-[var(--color-border)]'
      );
    });
  });

  describe('Icon spacing', () => {
    it('applies left icon spacing when a left icon exists', () => {
      render(<FormInput id="email" leftIcon={<span>@</span>} />);

      expect(screen.getByRole('textbox')).toHaveClass('pl-11');
    });

    it('applies default left spacing when no left icon exists', () => {
      render(<FormInput id="email" />);

      expect(screen.getByRole('textbox')).toHaveClass('pl-4');
    });

    it('reserves right spacing for a password input', () => {
      render(<FormInput id="password" type="password" />);

      expect(document.getElementById('password')).toHaveClass('pr-12');
    });

    it('reserves right spacing when a right icon exists', () => {
      render(<FormInput id="email" rightIcon={<span>Search</span>} />);

      expect(screen.getByRole('textbox')).toHaveClass('pr-12');
    });

    it('uses default right spacing when there is no password or right icon', () => {
      render(<FormInput id="email" />);

      expect(screen.getByRole('textbox')).toHaveClass('pr-4');
    });
  });
});
