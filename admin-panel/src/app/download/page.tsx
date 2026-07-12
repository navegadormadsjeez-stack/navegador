'use client';

import { useEffect, useState } from 'react';
import { DownloadButton } from '@/components/landing/DownloadButton';
import { fetchDownloadInfo, type DownloadInfo } from '@/lib/download';

export default function DownloadPage() {
  const [info, setInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloadInfo()
      .then(setInfo)
      .finally(() => setLoading(false));
  }, []);

  const sizeMB = info?.fileSize ? (info.fileSize / (1024 * 1024)).toFixed(0) : '~138';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#12121a] rounded-2xl border border-white/10 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-[#0a0a0f] font-display font-bold text-2xl mb-4">
            M
          </span>
          <h1 className="font-display text-2xl font-bold">Madsjeez Seller Browser</h1>
          <p className="text-zinc-400 mt-2">El navegador para vendedores online</p>
        </div>

        {loading ? (
          <p className="text-center text-zinc-500">Cargando...</p>
        ) : info?.available ? (
          <div className="space-y-6">
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10">
              <p className="text-sm text-zinc-500">Versión</p>
              <p className="text-xl font-semibold">v{info.version ?? '0.1.0'}</p>
              <p className="text-zinc-300 text-sm mt-2">{info.title}</p>
              <p className="text-zinc-500 text-xs mt-1">{sizeMB} MB · Windows 64-bit</p>
            </div>

            <DownloadButton
              variant="primary"
              className="w-full justify-center text-base"
            />

            <div className="text-sm text-zinc-400 space-y-2">
              <p className="font-medium text-zinc-300">Instalación:</p>
              <ol className="list-decimal list-inside space-y-1 text-zinc-500">
                <li>Extrae el ZIP descargado</li>
                <li>
                  Ejecuta <code className="text-zinc-300">Instalar.bat</code> o{' '}
                  <code className="text-zinc-300">MadsjeezSellerBrowser.exe</code>
                </li>
                <li>
                  Instala{' '}
                  <a
                    href="https://dotnet.microsoft.com/download/dotnet/8.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    .NET 8 Desktop Runtime
                  </a>{' '}
                  si te lo pide
                </li>
                <li>Inicia sesión o crea tu cuenta</li>
              </ol>
            </div>

            <p className="text-xs text-zinc-600 text-center">
              Demo: admin@madsjeez.com / Admin123!
            </p>
          </div>
        ) : (
          <div className="text-center text-zinc-500">
            <p>Descarga no disponible temporalmente.</p>
            <p className="text-sm mt-2">Contacta al administrador.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-2">
          <a href="/" className="block text-zinc-400 hover:text-white text-sm">
            ← Volver al inicio
          </a>
          <a href="/login" className="block text-indigo-400 hover:text-indigo-300 text-sm">
            Panel de administración →
          </a>
        </div>
      </div>
    </div>
  );
}
