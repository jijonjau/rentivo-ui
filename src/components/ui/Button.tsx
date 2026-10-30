import type { ButtonHTMLAttributes, ReactNode } from 'react';

// type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'iconOnly';
type ButtonVariant = 'primary' | 'outline' | 'iconOnly';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 hover:-translate-y-1 hover:scale-105 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] ${
    variant === 'iconOnly'
      ? ''
      : 'text-sm sm:text-base px-4 py-2.5 sm:px-6 sm:py-3'
  }`;

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--color-primary)] text-white shadow-sm hover:bg-blue-600 hover:shadow-md active:bg-blue-700 focus-visible:outline-blue-500 px-6 py-3',
    // secondary:
    //   'bg-slate-100 text-[var(--color-secondary-text)] hover:bg-slate-200 hover:shadow-sm active:bg-slate-300 focus-visible:outline-slate-500 px-6 py-3',
    outline:
      'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-blue-50 hover:border-blue-600 hover:shadow-sm active:bg-blue-100 focus-visible:outline-blue-500 px-6 py-3',
    iconOnly:
      'h-10 w-10 shrink-0 rounded-lg bg-transparent text-[var(--color-text)] hover:bg-slate-100 hover:text-[var(--color-primary)] active:bg-slate-200 focus-visible:outline-blue-500',
  };

  return (
    <button
      type={type}
      // className={`${baseStyles} ${variants[variant]} ${className}`}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-label={variant === 'iconOnly' ? props['aria-label'] : undefined}
      {...props}
    >
      {variant !== 'iconOnly' && leftIcon}
      {variant !== 'iconOnly' && children}
      {variant !== 'iconOnly' && rightIcon}

      {variant === 'iconOnly' && (leftIcon ?? rightIcon)}
    </button>
  );
}
