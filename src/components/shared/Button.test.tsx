import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save changes</Button>);

    expect(
      screen.getByRole('button', { name: 'Save changes' })
    ).toBeInTheDocument();
  });

  it('defaults to the primary variant', () => {
    render(<Button>Submit</Button>);

    const button = screen.getByRole('button', {
      name: 'Submit',
    });

    expect(button.className).toContain('bg-[var(--color-primary)]');
  });

  it('renders the outline variant', () => {
    render(<Button variant="outline">Cancel</Button>);

    const button = screen.getByRole('button', {
      name: 'Cancel',
    });

    expect(button.className).toContain('border-[var(--color-primary)]');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('defaults to button type instead of submit', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('supports a custom button type', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('applies full width when requested', () => {
    render(<Button fullWidth>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('w-full');
  });

  it('supports custom class names', () => {
    render(<Button className="custom-button">Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'custom-button'
    );
  });

  it('renders left and right icons', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Save
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('renders children in the iconOnly variant', () => {
    render(<Button variant="iconOnly">X</Button>);

    expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
  });

  it('uses aria-label for an iconOnly button', () => {
    render(
      <Button variant="iconOnly" aria-label="Close dialog">
        X
      </Button>
    );

    expect(
      screen.getByRole('button', { name: 'Close dialog' })
    ).toBeInTheDocument();
  });

  it('renders the left icon when children are not supplied', () => {
    render(
      <Button
        variant="iconOnly"
        leftIcon={<span data-testid="icon">Icon</span>}
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders the right icon when children and leftIcon are absent', () => {
    render(
      <Button
        variant="iconOnly"
        rightIcon={<span data-testid="right-icon">Icon</span>}
      />
    );

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});
