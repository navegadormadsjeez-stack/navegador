'use client';

import { useEffect, useState } from 'react';
import { Monitor, CheckCircle2 } from 'lucide-react';
import { DownloadButton } from './DownloadButton';
import { fetchDownloadInfo, type DownloadInfo } from '@/lib/download';

export function DownloadSection() {
  const [info, setInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloadInfo()
      .then(setInfo)
      .finally(() => setLoading(false));
  }, []);

  const sizeMB = info?.fileSize ? (info.fileSize / (1024 * 1024)).toFixed(0) : '~138';

  return (
    <section id="download" className="py-24 bg-[#08080c]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-brand-yellow text-sm font-medium tracking-wide uppercase mb-3">
          Descarga
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Empezá a vender mejor hoy
        </h2>
        <p className="mt-4 text-zinc-400 text-lg max-w-xl mx-auto">
          Gratis para Windows 64-bit. Requiere .NET 8 Desktop Runtime.
        </p>

        <div className="mt-12 p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
          {loading ? (
            <p className="text-zinc-500">Verificando disponibilidad...</p>
          ) : info?.available ? (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-6">
                <CheckCircle2 size={16} />
                v{info.version ?? '0.1.0'} disponible
              </div>

              <DownloadButton variant="large" />

              <p className="mt-4 text-zinc-500 text-sm">
                {sizeMB} MB · Instalador .exe · Windows 10/11 x64
              </p>

              {info.title && (
                <p className="mt-2 text-zinc-400 text-sm">{info.title}</p>
              )}
            </>
          ) : (
            <p className="text-zinc-500">
              Descarga temporalmente no disponible. Contactá al administrador.
            </p>
          )}

          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { step: '1', text: 'Descargá el instalador .exe' },
              { step: '2', text: 'Ejecutalo y confirmá la instalación' },
              { step: '3', text: 'El navegador se abre solo al terminar' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white text-xs font-medium">
                  {step}
                </span>
                <p className="text-zinc-400 text-sm pt-0.5">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-zinc-600 text-xs">
            <Monitor size={14} />
            Requiere .NET 8 Desktop Runtime x64 ·{' '}
            <a
              href="https://dotnet.microsoft.com/download/dotnet/8.0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              Descargar .NET 8
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
