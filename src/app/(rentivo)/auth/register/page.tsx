'use client';

import { useState, ChangeEvent, SubmitEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Lock } from 'lucide-react';
import FormInput from '@/src/components/shared/FormInput';
import Button from '@/src/components/shared/Button';
import Dropdown from '@/src/components/shared/Dropdown';
import { toast } from 'sonner';
import { saveAuthTokens } from '@/src/utils/saveAuthTokens';
import { AuthService } from '@/src/services/AuthService';

type AccountType = 'TENANT' | 'LANDLORD' | 'AGENCY';

const accountTypes = [
  { label: 'Tenant', value: 'TENANT' },
  { label: 'Landlord', value: 'LANDLORD' },
  { label: 'Rental Agency', value: 'AGENCY' },
];

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'TENANT' as AccountType,
  });

  //   const [businessDocument, setBusinessDocument] = useState<File | null>(null);

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

  //   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     setBusinessDocument(e.target.files?.[0] ?? null);
  //     setErrors((prev) => ({ ...prev, businessDocument: "" }));
  //   };

  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // if (formData.accountType === "AGENCY") {
    //   if (!formData.agencyName.trim()) {
    //     newErrors.agencyName = "Agency name is required.";
    //   }

    //   if (!formData.registrationNumber.trim()) {
    //     newErrors.registrationNumber = "Registration number is required.";
    //   }

    //   if (!businessDocument) {
    //     newErrors.businessDocument = "Business registration document is required.";
    //   }
    // }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await AuthService.register(formData);
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

      {/* Right - Registration Form */}
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

          {/* Heading */}
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
                Create Account
              </h2>

              <p className="mt-2 text-[var(--color-secondary-text)]">
                Join Rentivo and simplify your property experience.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* First and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                autoComplete="given-name"
                error={errors.firstName}
                leftIcon={<User size={18} />}
              />

              <FormInput
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                autoComplete="family-name"
                error={errors.lastName}
                leftIcon={<User size={18} />}
              />
            </div>

            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autoComplete="email"
              error={errors.email}
              leftIcon={<Mail size={18} />}
            />

            <FormInput
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +254 7XX XXX XXX"
              autoComplete="tel"
              error={errors.phone}
              leftIcon={<Phone size={18} />}
            />

            {/* Account Type */}
            <Dropdown
              label="I want to register as"
              id="accountType"
              //   name="accountType"
              options={accountTypes}
              value={formData.accountType}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  accountType: value as AccountType,
                }));
                // setBusinessDocument(null);
              }}
              placeholder="Select account type"
            />

            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              error={errors.password}
              leftIcon={<Lock size={18} />}
            />

            <FormInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              leftIcon={<Lock size={18} />}
            />

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              rightIcon={<ArrowRight size={18} />}
            >
              Create Account
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

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-[var(--color-secondary-text)]">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
