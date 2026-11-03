'use client';

import { useRouter } from 'next/navigation';
import Button from '../components/shared/Button';
import { ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';

export default function Home() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <div>
      <Header />
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex justify-center"
        style={{
          backgroundImage: "url('/images/rentivo-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/30"></div>

        <div className="relative z-10 text-center px-5 sm:px-6 pt-24 sm:pt-28 md:pt-32 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight">
            Find a place you&&apos;ll love to
          </h1>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] mt-2">
            Call Home
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[var(--color-secondary-text)] max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed">
            Discover quality homes that match your lifestyle and budget, or
            simplify property management, track rent payments and manage your
            properties — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-7 sm:mt-8">
            <Button
              rightIcon={<ArrowRight size={18} />}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>

            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
