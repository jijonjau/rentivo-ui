'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../shared/Button';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Properties', href: '/#properties' },
  { label: 'Contact Us', href: '/#contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <header className="relative z-50 w-full px-6 md:px-10 lg:px-16 py-5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Logo */}
        <Link href="/#home" className="flex items-center">
          <Image
            src="/icons/rentivo-logo.svg"
            alt="Rentivo"
            width={150}
            height={100}
            className="w-28 sm:w-32 md:w-36 lg:w-[150px] h-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[var(--color-text)] font-medium hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex justify-end">
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden justify-end">
          <Button
            variant="iconOnly"
            leftIcon={isOpen ? <X size={24} /> : <Menu size={24} />}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-[var(--color-border)] p-6 flex flex-col items-center gap-5 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[var(--color-text)] font-medium hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Button fullWidth onClick={handleGetStarted}>
            Get Started
          </Button>
        </nav>
      )}
    </header>
  );
}
