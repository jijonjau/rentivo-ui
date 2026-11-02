'use client';

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  labelAction?: ReactNode;
  error?: string;
}

export default function FormInput({
  label,
  leftIcon,
  rightIcon,
  labelAction,
  error,
  type = 'text',
  className = '',
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor={props.id}
            className="text-sm font-semibold text-[var(--color-text)]"
          >
            {label}
          </label>
          {labelAction}
        </div>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          className={`w-full rounded-lg border bg-white py-3 text-sm outline-none transition-all ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100'
          } ${leftIcon ? 'pl-11' : 'pl-4'} ${
            isPassword || rightIcon ? 'pr-12' : 'pr-4'
          } ${className}`}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[var(--color-primary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : (
          rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )
        )}
      </div>

      {error && (
        <p
          id={`${props.id}-error`}
          className="mt-1.5 text-xs font-medium text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
