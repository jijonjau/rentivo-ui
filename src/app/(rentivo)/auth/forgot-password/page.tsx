'use client';

import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import Image from 'next/image';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setError('');

    // TODO: Call forgot-password API and send OTP.
    router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left image panel */}
      <section
        className="hidden lg:flex sticky top-0 h-screen self-start relative bg-cover bg-center bg-no-repeat items-center justify-center p-12 xl:p-16"
        style={{
          backgroundImage: "url('/images/rentivo-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </section>

      {/* Right form panel */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex lg:hidden justify-center mb-10">
            <Image
              src="/icons/rentivo-logo.svg"
              alt="Rentivo"
              width={150}
              height={100}
              className="w-36 h-auto"
            />
          </Link>

          {/* Heading */}
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
                Forgot Password?
              </h2>
              <p className="mt-2 text-[var(--color-secondary-text)]">
                No worries! Enter your registered email address and we&apos;ll
                send you a verification code to reset your password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              error={error}
              leftIcon={<Mail size={18} />}
            />

            <Button type="submit" fullWidth>
              Send OTP Code
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
