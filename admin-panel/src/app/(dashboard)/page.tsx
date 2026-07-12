import { StatCard } from '@/components/StatCard';
import { fetchApi, DashboardStats } from '@/lib/api';

async function getStats(): Promise<DashboardStats> {
  const data = await fetchApi<DashboardStats>('/users/stats');
  return data ?? {
    totalUsers: 0,
    activeUsers: 0,
    proUsers: 0,
    aiRequestsToday: 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Resumen general de Madsjeez Seller Browser</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Usuarios totales" value={stats.totalUsers} icon="👥" color="indigo" />
        <StatCard title="Usuarios activos" value={stats.activeUsers} icon="✅" color="green" />
        <StatCard title="Planes Pro/Enterprise" value={stats.proUsers} icon="⭐" color="yellow" />
        <StatCard title="Requests IA hoy" value={stats.aiRequestsToday} icon="🤖" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Roadmap</h2>
          <div className="space-y-3">
            {[
              { phase: 'Fase 1', label: 'Navegador funcional', status: 'done' },
              { phase: 'Fase 2', label: 'IA integrada', status: 'active' },
              { phase: 'Fase 3', label: 'Marketplace', status: 'pending' },
              { phase: 'Fase 4', label: 'Publicación masiva', status: 'pending' },
              { phase: 'Fase 5', label: 'Automatizaciones', status: 'pending' },
            ].map((item) => (
              <div key={item.phase} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  item.status === 'done' ? 'bg-green-500' :
                  item.status === 'active' ? 'bg-indigo-500' : 'bg-slate-600'
                }`} />
                <span className="text-slate-400 text-sm w-16">{item.phase}</span>
                <span className="text-white text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Estado del sistema</h2>
          <div className="space-y-3">
            {[
              { service: 'API Backend', status: 'online' },
              { service: 'PostgreSQL', status: 'online' },
              { service: 'Redis', status: 'online' },
              { service: 'Cloudflare R2', status: 'pending' },
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between">
                <span className="text-slate-300">{item.service}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'online'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
