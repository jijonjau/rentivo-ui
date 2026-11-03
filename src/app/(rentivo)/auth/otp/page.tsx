'use client';

import {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ClipboardEvent,
  SubmitEvent,
  Suspense,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Button from '@/src/components/shared/Button';
import { useRouter } from 'next/navigation';
import PageLoader from '@/src/components/shared/PageLoader';
import { saveAuthTokens } from '@/src/utils/saveAuthTokens';
import { toast } from 'sonner';
import { OtpTokenPayload } from '@/src/types/auth';
import { AuthService } from '@/src/services/AuthService';
import { jwtDecode } from 'jwt-decode';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(180);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  // const searchParams = useSearchParams();
  // const email = searchParams.get('email');
  const router = useRouter();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updatedOtp = [...otp];

    updatedOtp[index] = digit;
    setOtp(updatedOtp);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedDigits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    const updatedOtp = [...otp];

    pastedDigits.split('').forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(pastedDigits.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleResendOtp = () => {
    if (timeLeft > 0) return;

    // TODO: Call the resend OTP API here.
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(180);
    inputsRef.current[0]?.focus();
  };

  const handleVerify = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const code = otp.join('');

    if (code.length !== 6) return;

    const otpToken = sessionStorage.getItem('otpToken');

    if (!otpToken) {
      toast.error('OTP session expired. Please try again.');
      return;
    }

    try {
      const decoded = jwtDecode<OtpTokenPayload>(otpToken);

      const response = await AuthService.verifyOtp({ otp: code });

      sessionStorage.removeItem('otpToken');

      switch (decoded.type) {
        case 'LOGIN_OTP':
          saveAuthTokens(response.payload);
          router.push('/dashboard');
          break;

        case 'REGISTER_OTP':
          router.push('/auth/login');
          break;

        case 'PASSWORD_RESET_OTP':
          saveAuthTokens(response.payload);
          router.push('/auth/reset-password');
          break;
      }

      toast.success(response.statusDesc || 'OTP verified successfully');
    } catch {
      // Axios handles backend errors.
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section */}
      <div
        className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen self-start relative bg-cover bg-center bg-no-repeat items-center justify-center p-12 xl:p-16"
        style={{ backgroundImage: "url('/images/rentivo-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Right section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
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
                  Verify Your Email
                </h2>

                <p className="mt-2 text-[var(--color-secondary-text)]">
                  We&apos;ve sent a 6-digit verification code to your email
                  address. Please enter it below to continue.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerify}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-7">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${index + 1}`}
                  required
                  className="h-12 w-11 sm:h-14 sm:w-14 rounded-lg border border-[var(--color-border)] bg-white text-center text-xl font-semibold text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
                />
              ))}
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={otp.some((digit) => !digit)}
            >
              Verify Email
            </Button>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-1 text-center text-sm">
            <span className="text-[var(--color-secondary-text)]">
              Didn&apos;t receive the OTP code?
            </span>

            {timeLeft > 0 ? (
              <span className="font-medium text-[var(--color-text)]">
                Resend in{' '}
                <span className="text-[var(--color-primary)] tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
