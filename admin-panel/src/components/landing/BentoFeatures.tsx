'use client';

import type { ReactNode } from 'react';
import {
  Brain,
  Layers,
  Package,
  Palette,
  Star,
  Store,
} from 'lucide-react';
import { BENTO_FEATURES } from '@/lib/landing-content';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from './motion/FadeIn';
import { cn } from '@/lib/utils';

const VISUALS: Record<string, ReactNode> = {
  workspaces: (
    <div className="mt-4 flex gap-2">
      {['Maqjeez', 'M.Natural'].map((w, i) => (
        <div
          key={w}
          className={cn(
            'rounded-lg border px-3 py-2 text-[11px]',
            i === 0 ? 'border-brand/30 bg-brand/10 text-brand' : 'border-border text-muted',
          )}
        >
          {w}
        </div>
      ))}
    </div>
  ),
  favorites: (
    <div className="mt-4 space-y-1.5">
      {['Publicación Nike', 'Pack x3 remeras'].map((t) => (
        <div key={t} className="rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-[11px] text-muted truncate">
          {t}
        </div>
      ))}
    </div>
  ),
  ai: (
    <div className="mt-4 rounded-lg border border-border bg-background/60 p-2.5 text-[11px] leading-relaxed text-muted">
      Respuesta generada para consulta de talle...
    </div>
  ),
  products: (
    <div className="mt-4 grid grid-cols-2 gap-1.5">
      {[1, 2].map((n) => (
        <div key={n} className="h-10 rounded-md border border-border bg-background/60" />
      ))}
    </div>
  ),
  seller: (
    <div className="mt-4 flex items-center gap-2 text-[11px] text-muted">
      <Store size={14} className="text-brand" />
      Flujo orientado a publicaciones
    </div>
  ),
  profiles: (
    <div className="mt-4 flex gap-2">
      <div className="h-8 w-8 rounded-lg bg-brand/20 border border-brand/30" />
      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20" />
    </div>
  ),
};

const ICONS = {
  workspaces: Layers,
  favorites: Star,
  ai: Brain,
  products: Package,
  seller: Store,
  profiles: Palette,
};

export function BentoFeatures() {
  return (
    <section id="funciones" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-medium text-brand">Funciones</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Herramientas concretas para tu operación diaria
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Cada módulo resuelve una tarea real del vendedor online, integrada en el navegador.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENTO_FEATURES.map((f, i) => {
            const Icon = ICONS[f.id as keyof typeof ICONS];
            return (
              <FadeIn key={f.id} delay={i * 0.05} className={f.span}>
                <Card className="h-full transition-colors hover:border-border-strong hover:bg-surface/60">
                  <CardHeader>
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/80 text-brand">
                      <Icon size={16} aria-hidden />
                    </span>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                    {VISUALS[f.id]}
                  </CardHeader>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
