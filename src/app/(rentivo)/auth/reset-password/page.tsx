'use client';

import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Lock, Check, X } from 'lucide-react';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import zxcvbn from 'zxcvbn';

export default function ResetPassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      valid: newPassword.length >= 8,
    },
    {
      label: 'One uppercase letter',
      valid: /[A-Z]/.test(newPassword),
    },
    {
      label: 'One lowercase letter',
      valid: /[a-z]/.test(newPassword),
    },
    {
      label: 'One number',
      valid: /[0-9]/.test(newPassword),
    },
    {
      label: 'One special character',
      valid: /[^A-Za-z0-9]/.test(newPassword),
    },
  ];

  const allChecksPassed = passwordChecks.every((check) => check.valid);

  const passwordStrength = newPassword ? zxcvbn(newPassword).score : -1;

  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    if (!allChecksPassed) {
      nextErrors.newPassword = 'Please meet all password requirements.';
    } else if (passwordStrength < 3) {
      nextErrors.newPassword = 'Please choose a stronger password.';
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);

    if (nextErrors.newPassword || nextErrors.confirmPassword) return;

    // TODO: Call reset-password API after OTP verification.
    router.push('/auth/login');
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left - Background Image */}
      <section
        className="hidden lg:flex sticky top-0 h-screen self-start relative bg-cover bg-center bg-no-repeat items-center justify-center p-12 xl:p-16"
        style={{
          backgroundImage: "url('/images/rentivo-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </section>

      {/* Right - Reset Password Form */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden justify-center mb-10">
            <Image
              src="/icons/rentivo-logo.svg"
              alt="Rentivo"
              width={150}
              height={100}
              className="w-36 h-auto"
            />
          </Link>

          <div className="mb-8">
            <Link
              href="/auth/login"
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-primary)]"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <h2 className="text-3xl font-bold text-[var(--color-text)]">
                Reset Password
              </h2>

              <p className="mt-2 text-[var(--color-secondary-text)]">
                Create a new secure password for your Rentivo account.
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New Password */}
            <FormInput
              label="New Password"
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPassword: '',
                }));
              }}
              placeholder="Enter your new password"
              autoComplete="new-password"
              //   required
              error={errors.newPassword}
              leftIcon={<Lock size={18} />}
            />

            {/* Password Requirements */}
            <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Password requirements
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {passwordChecks.map((check) => (
                  <div
                    key={check.label}
                    className={`flex items-center gap-2 text-xs ${
                      check.valid
                        ? 'text-emerald-600'
                        : 'text-[var(--color-secondary-text)]'
                    }`}
                  >
                    {check.valid ? <Check size={15} /> : <X size={15} />}
                    <span>{check.label}</span>
                  </div>
                ))}
              </div>

              {/* Password Strength */}
              {newPassword && (
                <div className="pt-2 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--color-secondary-text)]">
                      Password strength
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text)]">
                      {strengthLabels[passwordStrength]}
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          level <= passwordStrength
                            ? passwordStrength <= 1
                              ? 'bg-red-500'
                              : passwordStrength === 2
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <FormInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: '',
                }));
              }}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              //   required
              error={errors.confirmPassword}
              leftIcon={<Lock size={18} />}
            />

            <Button
              type="submit"
              fullWidth
              rightIcon={<ArrowRight size={18} />}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
