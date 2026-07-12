'use client';

import { clsx } from 'clsx';
import { Download } from 'lucide-react';
import { DOWNLOAD_ROUTE, DOWNLOAD_FILENAME } from '@/lib/download';

type Variant = 'primary' | 'nav' | 'large';

const styles: Record<Variant, string> = {
  primary:
    'inline-flex items-center gap-2 bg-brand-yellow text-[#0a0a0f] font-semibold px-7 py-3.5 rounded-full hover:bg-amber-300 transition-all shadow-xl shadow-brand-yellow/20 hover:shadow-brand-yellow/30 hover:-translate-y-0.5',
  nav: 'text-sm font-medium bg-brand-yellow text-[#0a0a0f] px-5 py-2.5 rounded-full hover:bg-amber-300 transition-colors shadow-lg shadow-brand-yellow/25',
  large:
    'inline-flex items-center gap-3 bg-brand-yellow text-[#0a0a0f] font-semibold text-lg px-10 py-4 rounded-full hover:bg-amber-300 transition-all shadow-xl shadow-brand-yellow/25 hover:-translate-y-0.5',
};

interface DownloadButtonProps {
  variant?: Variant;
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export function DownloadButton({
  variant = 'primary',
  className,
  label = 'Descargar para Windows',
  showIcon = true,
}: DownloadButtonProps) {
  return (
    <a
      href={DOWNLOAD_ROUTE}
      className={clsx(styles[variant], className)}
      download={DOWNLOAD_FILENAME}
    >
      {showIcon && <Download size={variant === 'large' ? 22 : 18} />}
      {label}
    </a>
  );
}
