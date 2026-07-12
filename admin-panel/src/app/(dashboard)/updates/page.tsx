'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface AppUpdate {
  id: string;
  version: string;
  title: string;
  description: string;
  downloadUrl: string;
  isMandatory: boolean;
  publishedAt: string;
  channel: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<AppUpdate[]>([]);

  useEffect(() => {
    fetchApi<AppUpdate[]>('/updates').then((data) => {
      if (data) setUpdates(data);
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Versiones</h1>
        <p className="text-slate-400 mt-1">Gestión de actualizaciones del navegador</p>
      </div>

      <div className="space-y-4">
        {updates.length > 0 ? (
          updates.map((update) => (
            <div key={update.id} className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">v{update.version}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      {update.channel}
                    </span>
                  </div>
                  <p className="text-white mt-1">{update.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{update.description}</p>
                </div>
                <p className="text-slate-500 text-sm">
                  {new Date(update.publishedAt).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center text-slate-500">
            No hay versiones registradas. Ejecuta el seed del backend.
          </div>
        )}
      </div>
    </div>
  );
}
