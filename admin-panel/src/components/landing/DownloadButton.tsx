'use client';

import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { DOWNLOAD_ROUTE, DOWNLOAD_FILENAME } from '@/lib/download';

type Variant = 'primary' | 'nav' | 'large';

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
  const size = variant === 'large' ? 'lg' : variant === 'nav' ? 'sm' : 'default';

  return (
    <a
      href={DOWNLOAD_ROUTE}
      download={DOWNLOAD_FILENAME}
      className={cn(
        buttonVariants({ variant: 'default', size }),
        variant === 'nav' && 'h-9 rounded-full px-4',
        variant === 'large' && 'h-12 rounded-xl px-8 text-base',
        className,
      )}
    >
      {showIcon && <Download size={variant === 'large' ? 20 : 16} aria-hidden />}
      {label}
    </a>
  );
}
