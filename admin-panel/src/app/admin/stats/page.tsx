'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function StatsPage() {
  const [telemetry, setTelemetry] = useState<{
    total: number;
    errors: number;
    byType: Array<{ eventType: string; _count: number }>;
  } | null>(null);

  useEffect(() => {
    fetchApi<{
      total: number;
      errors: number;
      byType: Array<{ eventType: string; _count: number }>;
    }>('/telemetry/stats').then(setTelemetry);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
        <p className="text-slate-400 mt-1">Telemetría y rendimiento del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <p className="text-slate-400 text-sm">Eventos totales</p>
          <p className="text-3xl font-bold text-white mt-2">{telemetry?.total ?? 0}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <p className="text-slate-400 text-sm">Errores reportados</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{telemetry?.errors ?? 0}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <p className="text-slate-400 text-sm">Tipos de evento</p>
          <p className="text-3xl font-bold text-indigo-400 mt-2">{telemetry?.byType?.length ?? 0}</p>
        </div>
      </div>

      {telemetry?.byType && telemetry.byType.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Eventos por tipo</h2>
          <div className="space-y-2">
            {telemetry.byType.map((item) => (
              <div key={item.eventType} className="flex justify-between">
                <span className="text-slate-300">{item.eventType}</span>
                <span className="text-white">{item._count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
