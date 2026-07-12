export function BrowserMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto animate-float">
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-yellow/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60" />
      <div className="relative rounded-2xl border border-white/10 bg-[#12121a] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a24] border-b border-white/5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-[#0a0a0f] rounded-lg px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-2">
              <span className="text-emerald-400">🔒</span>
              mercadolibre.com.ar/publicaciones
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-yellow font-medium">
            Maqjeez
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 pt-2 bg-[#14141c] border-b border-white/5">
          {['Publicaciones', 'Métricas', 'Respuestas IA'].map((tab, i) => (
            <div
              key={tab}
              className={`px-3 py-1.5 text-[11px] rounded-t-lg ${
                i === 0
                  ? 'bg-[#12121a] text-white border-t border-x border-white/10'
                  : 'text-zinc-500'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex h-64">
          <aside className="w-44 border-r border-white/5 bg-[#0e0e14] p-3 space-y-2 hidden sm:block">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Favoritos</p>
            {['Zapatillas Nike', 'Remera XL', 'Botines cuero'].map((item) => (
              <div
                key={item}
                className="text-[11px] text-zinc-400 px-2 py-1.5 rounded-lg hover:bg-white/5 truncate"
              >
                {item}
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[10px] text-brand-yellow">✨ IA activa</p>
            </div>
          </aside>
          <main className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">12 publicaciones activas</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                +23% ventas
              </span>
            </div>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03] border border-white/5"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-2 w-3/4 bg-zinc-700 rounded mb-1.5" />
                  <div className="h-1.5 w-1/2 bg-zinc-800 rounded" />
                </div>
                <span className="text-[10px] text-zinc-500">$45.{n}00</span>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
