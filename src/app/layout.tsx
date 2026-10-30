import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Rentivo | Find a Place to Call Home',
    template: '%s | Rentivo',
  },
  description:
    'Discover quality rental homes, manage properties, track rent payments, and simplify property management with Rentivo.',
  applicationName: 'Rentivo',
  keywords: [
    'Rentivo',
    'rental properties',
    'property management',
    'house rentals',
    'landlord management',
    'tenant management',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* <Header /> */}
        {children}
      </body>
    </html>
  );
}
