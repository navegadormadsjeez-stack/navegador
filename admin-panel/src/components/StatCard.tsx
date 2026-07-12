interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'indigo' | 'green' | 'yellow' | 'purple';
}

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
  green: 'from-green-500/20 to-green-600/5 border-green-500/30',
  yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
};

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-slate-400 text-sm mt-1">{title}</p>
    </div>
  );
}
