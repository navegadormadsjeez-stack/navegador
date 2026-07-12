import { Cloud, KeyRound, Lock } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from './motion/FadeIn';

const ITEMS = [
  {
    icon: Lock,
    title: 'Conexiones HTTPS',
    description:
      'El navegador utiliza el motor Chromium estándar para sitios web. La seguridad del sitio depende del certificado de cada dominio.',
  },
  {
    icon: KeyRound,
    title: 'Cuenta y sesión',
    description:
      'Iniciás sesión con email y contraseña. Los tokens se gestionan en la app desktop; no compartimos credenciales de MercadoLibre.',
  },
  {
    icon: Cloud,
    title: 'Datos en la nube',
    description:
      'Favoritos, workspaces y configuración se almacenan en servidores Madsjeez. Consultá nuestras políticas antes de operar datos sensibles.',
  },
];

export function Security() {
  return (
    <section id="seguridad" className="border-y border-border bg-surface/20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-medium text-brand">Seguridad</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Transparencia sobre cómo funciona hoy
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            v0.1.0 es un MVP. No prometemos bloqueo de rastreadores ni certificaciones que aún no implementamos.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <Card className="h-full">
                <CardHeader>
                  <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-border text-brand">
                    <item.icon size={16} aria-hidden />
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
