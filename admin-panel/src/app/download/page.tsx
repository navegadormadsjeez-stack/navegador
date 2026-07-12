'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor } from 'lucide-react';
import { DownloadButton } from '@/components/landing/DownloadButton';
import { GridBackground } from '@/components/landing/GridBackground';
import { fetchDownloadInfo, type DownloadInfo } from '@/lib/download';
import { APP_VERSION } from '@/lib/landing-content';

export default function DownloadPage() {
  const [info, setInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloadInfo()
      .then(setInfo)
      .finally(() => setLoading(false));
  }, []);

  const sizeMB = info?.fileSize
    ? (info.fileSize / (1024 * 1024)).toFixed(0)
    : '~98';

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <GridBackground />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface/80 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <span
              className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand font-display text-2xl font-bold text-brand-foreground"
              aria-hidden
            >
              M
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Madsjeez Seller Browser
            </h1>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Navegador para vendedores en Mercado Libre, Amazon y Tienda Nube
            </p>
          </div>

          {loading ? (
            <p className="text-center text-muted" role="status">
              Cargando información de descarga…
            </p>
          ) : info?.available ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-background/50 p-5">
                <p className="text-xs uppercase tracking-wide text-muted">Versión</p>
                <p className="mt-1 font-display text-xl font-semibold">
                  v{info.version ?? APP_VERSION}
                </p>
                {info.title && (
                  <p className="mt-2 text-sm text-foreground/90">{info.title}</p>
                )}
                <p className="mt-3 flex items-center gap-2 text-xs text-muted sm:text-sm">
                  <Monitor size={14} aria-hidden />
                  {sizeMB} MB · Instalador .exe · Windows 10/11 x64
                </p>
              </div>

              <DownloadButton
                variant="large"
                className="w-full justify-center"
                label="Descargar instalador"
              />

              <div className="space-y-2 text-sm text-muted">
                <p className="font-medium text-foreground">Instalación con asistente</p>
                <ol className="list-inside list-decimal space-y-1.5">
                  <li>Descargá el instalador .exe</li>
                  <li>Seguí el asistente (Siguiente → Instalar → Finalizar)</li>
                  <li>
                    Si lo pide, instalá{' '}
                    <a
                      href="https://dotnet.microsoft.com/download/dotnet/8.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-sm"
                    >
                      .NET 8 Desktop Runtime
                    </a>
                  </li>
                  <li>Se crea el acceso directo en el escritorio y menú Inicio</li>
                  <li>Al terminar, marcá “Abrir Madsjeez Seller Browser” o Finalizar</li>
                </ol>
              </div>

              <p className="text-center text-xs text-muted/70">
                Demo: admin@madsjeez.com / Admin123!
              </p>
            </div>
          ) : (
            <div className="text-center text-muted" role="alert">
              <p>Descarga no disponible temporalmente.</p>
              <p className="mt-2 text-sm">Contactá al administrador.</p>
            </div>
          )}

          <div className="mt-8 space-y-3 border-t border-border pt-6 text-center text-sm">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-sm"
            >
              <ArrowLeft size={14} aria-hidden />
              Volver al inicio
            </Link>
            <Link
              href="/login"
              className="block text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-sm"
            >
              Panel de administración
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
