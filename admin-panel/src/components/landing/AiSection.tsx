import { MessageSquare, Sparkles, Wand2 } from 'lucide-react';

const capabilities = [
  {
    icon: MessageSquare,
    title: 'Respuestas automáticas',
    description: 'Redacta respuestas profesionales a preguntas de compradores en segundos.',
  },
  {
    icon: Wand2,
    title: 'Optimización de listings',
    description: 'Mejora títulos, bullets y descripciones para mejor conversión.',
  },
  {
    icon: Sparkles,
    title: 'Contexto por perfil',
    description: 'La IA conoce tu marca y adapta el tono según el workspace activo.',
  },
];

export function AiSection() {
  return (
    <section id="ai" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12121a] to-[#0e0e14] p-8 sm:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium mb-6">
                <Sparkles size={12} />
                Inteligencia artificial
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                IA que entiende tu negocio
              </h2>
              <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
                Integrada directamente en el navegador. Sin copiar y pegar entre
                herramientas — generá contenido mientras navegás tus publicaciones.
              </p>
            </div>

            <div className="space-y-4">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <div className="shrink-0 p-2.5 rounded-lg bg-purple-500/10 text-purple-400 h-fit">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{title}</h3>
                    <p className="text-zinc-400 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo chat bubble */}
          <div className="mt-12 p-4 rounded-2xl bg-[#0a0a0f] border border-white/5 max-w-xl mx-auto">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs shrink-0">
                IA
              </div>
              <div className="flex-1">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  &ldquo;Hola! Sí, el talle 42 está disponible en negro y marrón.
                  Enviamos en 24 hs con Mercado Envíos. ¿Te ayudo con algo más?&rdquo;
                </p>
                <p className="text-zinc-600 text-xs mt-2">Generado en 1.2s · Perfil Maqjeez</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
