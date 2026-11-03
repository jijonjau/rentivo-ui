'use client';

import { SubmitEvent, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '@/src/components/shared/Button';
import FormInput from '@/src/components/shared/FormInput';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/services/AuthService';
import { saveAuthTokens } from '@/src/utils/saveAuthTokens';
import { toast } from 'sonner';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      const response = await AuthService.login(formData);
      saveAuthTokens(response.payload);
      toast.success(response.statusDesc || 'OTP sent successfully');
      router.push('/auth/otp');
    } catch {
      // Axios already displays the backend error toast.
    }
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

      {/* Right - Login Form */}
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
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-primary)]"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <h2 className="text-3xl font-bold text-[var(--color-text)]">
                Welcome Back!
              </h2>

              <p className="mt-2 text-[var(--color-secondary-text)]">
                Sign in to your Rentivo account to continue.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autoComplete="email"
              //   required
              error={errors.email}
              leftIcon={<Mail size={18} />}
            />

            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              //   required
              error={errors.password}
              leftIcon={<Lock size={18} />}
              labelAction={
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  Forgot Password?
                </Link>
              }
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              rightIcon={<ArrowRight size={18} />}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 border-t border-[var(--color-border)]" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="flex-1 border-t border-[var(--color-border)]" />
          </div>

          {/* Google Login */}
          <Button
            variant="outline"
            fullWidth
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 2-7 2-5.3 0-9.8-3.6-11.4-8.4H5.9v5.2C9.3 39.6 16.1 44 24 44z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.9a20 20 0 0 0 0 18l6.7-5.2z"
                />
                <path
                  fill="#EA4335"
                  d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4 16.1 4 9.3 8.4 5.9 15l6.7 5.2c1.6-4.8 6.1-8.4 11.4-8.4z"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>

          {/* Register */}
          <p className="text-center text-sm text-[var(--color-secondary-text)] mt-8">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
