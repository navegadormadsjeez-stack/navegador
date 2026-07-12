const profiles = [
  {
    name: 'Maqjeez',
    tagline: 'Moda y calzado',
    color: 'from-brand-yellow to-amber-400',
    accent: 'text-brand-yellow',
    border: 'border-brand-yellow/30',
    items: ['Publicaciones de calzado', 'Respuestas con tono casual', 'Métricas de temporada'],
  },
  {
    name: 'Materia Natural',
    tagline: 'Productos naturales',
    color: 'from-emerald-500 to-teal-400',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    items: ['Catálogo orgánico', 'IA con enfoque wellness', 'Favoritos por línea'],
  },
];

export function ProfilesShowcase() {
  return (
    <section id="profiles" className="py-24 bg-[#08080c]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-indigo-400 text-sm font-medium tracking-wide uppercase mb-3">
              Workspaces
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Un navegador, múltiples marcas
            </h2>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              Cada workspace mantiene sus favoritos, productos y configuración de IA
              separados. Cambiá de perfil sin cerrar sesión ni mezclar operaciones.
            </p>
            <ul className="mt-8 space-y-3">
              {['Sin mezclar cuentas ni datos', 'Colores e identidad por marca', 'Ideal para multi-tienda'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="space-y-4">
            {profiles.map(({ name, tagline, color, accent, border, items }) => (
              <div
                key={name}
                className={`p-6 rounded-2xl border ${border} bg-white/[0.02] hover:bg-white/[0.04] transition-colors`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-[#0a0a0f] font-display font-bold`}
                  >
                    {name[0]}
                  </div>
                  <div>
                    <h3 className={`font-display font-semibold text-white ${accent}`}>
                      {name}
                    </h3>
                    <p className="text-zinc-500 text-xs">{tagline}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="text-zinc-400 text-sm pl-4 border-l border-white/10">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
