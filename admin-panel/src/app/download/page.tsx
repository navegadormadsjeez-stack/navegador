'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://navegador-production.up.railway.app/api/v1';

interface DownloadInfo {
  available: boolean;
  version?: string;
  title?: string;
  description?: string;
  downloadUrl?: string;
  checksum?: string;
  fileSize?: number;
}

export default function DownloadPage() {
  const [info, setInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/updates/latest`)
      .then((r) => r.json())
      .then((data) => {
        setInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sizeMB = info?.fileSize ? (info.fileSize / (1024 * 1024)).toFixed(0) : '~138';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚡</div>
          <h1 className="text-2xl font-bold">Madsjeez Seller Browser</h1>
          <p className="text-slate-400 mt-2">El navegador para vendedores online</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Cargando...</p>
        ) : info?.available && info.downloadUrl ? (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Versión</p>
              <p className="text-xl font-semibold">v{info.version}</p>
              <p className="text-slate-300 text-sm mt-2">{info.title}</p>
              <p className="text-slate-500 text-xs mt-1">{sizeMB} MB · Windows 64-bit</p>
            </div>

            <a
              href={info.downloadUrl}
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Descargar para Windows
            </a>

            <div className="text-sm text-slate-400 space-y-2">
              <p className="font-medium text-slate-300">Instalación:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-500">
                <li>Extrae el ZIP descargado</li>
                <li>Ejecuta <code className="text-slate-300">Instalar.bat</code> o <code className="text-slate-300">MadsjeezSellerBrowser.exe</code></li>
                <li>Instala .NET 8 Desktop Runtime si te lo pide</li>
                <li>Inicia sesión o crea tu cuenta</li>
              </ol>
            </div>

            <p className="text-xs text-slate-600 text-center">
              Demo: admin@madsjeez.com / Admin123!
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <p>Descarga no disponible temporalmente.</p>
            <p className="text-sm mt-2">Contacta al administrador.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm">
            Panel de administración →
          </a>
        </div>
      </div>
    </div>
  );
}
