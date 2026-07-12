'use client';

import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import { APP_VERSION } from '@/lib/landing-content';
import { fetchDownloadInfo, type DownloadInfo } from '@/lib/download';
import { FadeIn } from './motion/FadeIn';
import { DownloadButton } from './DownloadButton';

export function FinalCTA() {
  const [info, setInfo] = useState<DownloadInfo | null>(null);

  useEffect(() => {
    fetchDownloadInfo().then(setInfo);
  }, []);

  const sizeMB = info?.fileSize
    ? (info.fileSize / (1024 * 1024)).toFixed(0)
    : '~98';

  return (
    <section id="descargar" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeIn>
          <div className="rounded-3xl border border-border bg-surface/50 p-8 text-center sm:p-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Descargá Madsjeez Seller Browser
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Instalador para Windows. Icono en el escritorio y apertura automática al terminar.
            </p>

            <div className="mt-8 flex justify-center">
              <DownloadButton variant="large" label="Descargar gratis" />
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted sm:text-sm">
              <Monitor size={14} aria-hidden />
              v{info?.version ?? APP_VERSION} · {sizeMB} MB · Windows 10/11 x64
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
