import {
  Brain,
  Cloud,
  Layers,
  Package,
  Star,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Perfiles por marca',
    description:
      'Cambia entre Maqjeez, Materia Natural u otros workspaces con un clic. Cada perfil con su identidad y datos separados.',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10',
  },
  {
    icon: Star,
    title: 'Favoritos inteligentes',
    description:
      'Guarda publicaciones clave y accede rápido desde la barra lateral. Sincronizados en la nube entre dispositivos.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Brain,
    title: 'IA integrada',
    description:
      'Genera respuestas a compradores, mejora títulos y descripciones sin salir del navegador.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Package,
    title: 'Gestión de productos',
    description:
      'Organiza tu catálogo, precios y stock desde el panel integrado conectado a la API.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  {
    icon: Cloud,
    title: 'Sync en la nube',
    description:
      'Tu configuración, favoritos y preferencias siempre disponibles al iniciar sesión.',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
  {
    icon: Users,
    title: 'Multi-usuario',
    description:
      'Equipos con roles y planes. Ideal para agencias y operaciones con varios vendedores.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#0a0a0f] relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-brand-yellow text-sm font-medium tracking-wide uppercase mb-3">
            Funciones
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Todo lo que necesitás para vender más
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Un navegador completo con herramientas pensadas para el día a día del vendedor
            en marketplaces latinoamericanos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <article
              key={title}
              className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              <div
                className={`inline-flex p-3 rounded-xl ${bg} ${color} mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
