'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  description,
  showBackButton = false,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-start gap-3">
      {showBackButton && (
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
