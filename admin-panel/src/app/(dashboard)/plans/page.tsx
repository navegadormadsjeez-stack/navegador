import { fetchApi } from '@/lib/api';

export default async function PlansPage() {
  const stats = await fetchApi<Array<{ plan: string; _count: number; _sum: { aiRequestsUsed: number | null } }>>('/subscriptions/stats');

  const plans = [
    { name: 'Gratuito', key: 'FREE', limit: 50, price: '$0', features: ['50 requests IA/mes', '2 workspaces', 'Navegador completo'] },
    { name: 'Pro', key: 'PRO', limit: 500, price: '$19/mes', features: ['500 requests IA/mes', '10 workspaces', 'Soporte prioritario', 'Productos ilimitados'] },
    { name: 'Empresarial', key: 'ENTERPRISE', limit: 10000, price: '$99/mes', features: ['10.000 requests IA/mes', 'Workspaces ilimitados', 'API dedicada', 'CRM (próximamente)'] },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Planes de suscripción</h1>
        <p className="text-slate-400 mt-1">Gestión de planes y límites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const stat = stats?.find((s) => s.plan === plan.key);
          return (
            <div key={plan.key} className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <p className="text-3xl font-bold text-indigo-400 mt-2">{plan.price}</p>
              <p className="text-slate-400 text-sm mt-1">{plan.limit} requests IA/mes</p>
              <p className="text-slate-500 text-sm mt-3">{stat?._count ?? 0} suscriptores</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-slate-300 text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
