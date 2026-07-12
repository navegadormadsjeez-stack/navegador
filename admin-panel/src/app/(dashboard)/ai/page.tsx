import { fetchApi, AiStats } from '@/lib/api';

export default async function AiPage() {
  const stats = await fetchApi<AiStats>('/ai/stats');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Consumo de IA</h1>
        <p className="text-slate-400 mt-1">Estadísticas de uso del asistente Madsjeez AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <p className="text-slate-400 text-sm">Total requests</p>
          <p className="text-4xl font-bold text-white mt-2">{stats?.total ?? 0}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <p className="text-slate-400 text-sm">Últimas 24 horas</p>
          <p className="text-4xl font-bold text-indigo-400 mt-2">{stats?.last24h ?? 0}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Por tipo de request</h2>
        {stats?.byType && stats.byType.length > 0 ? (
          <div className="space-y-3">
            {stats.byType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-slate-300">{item.type}</span>
                <span className="text-white font-medium">{item._count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">Sin datos de consumo IA aún.</p>
        )}
      </div>
    </div>
  );
}
