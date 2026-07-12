'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { DEMO_TABS, type DemoTabId } from '@/lib/landing-content';
import { FadeIn } from './motion/FadeIn';
import { BrowserMockup } from './BrowserMockup';

function DemoPanel({ tab }: { tab: DemoTabId }) {
  const panels: Record<DemoTabId, ReactNode> = {
    browse: (
      <p className="text-sm text-muted leading-relaxed">
        Navegá MercadoLibre, WhatsApp Web y tus sitios habituales con pestañas y favoritos laterales.
      </p>
    ),
    workspaces: (
      <p className="text-sm text-muted leading-relaxed">
        Cambiá entre Maqjeez y Materia Natural sin mezclar favoritos, productos ni configuración de IA.
      </p>
    ),
    ai: (
      <p className="text-sm text-muted leading-relaxed">
        Abrí el panel de IA para redactar respuestas a compradores mientras revisás una publicación.
      </p>
    ),
    products: (
      <p className="text-sm text-muted leading-relaxed">
        Consultá y administrá productos del catálogo conectado a tu cuenta desde el mismo entorno.
      </p>
    ),
  };
  return panels[tab];
}

export function ProductDemo() {
  const [tab, setTab] = useState<DemoTabId>('browse');
  const reduce = useReducedMotion();

  return (
    <section id="demo" className="border-y border-border bg-surface/20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-medium text-brand">Producto</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Un entorno de trabajo, no solo una ventana
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Demostración de funciones"
            >
              {DEMO_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    tab === id
                      ? 'border-brand/30 bg-brand/10 text-brand'
                      : 'border-border text-muted hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 min-h-[5rem]" role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <DemoPanel tab={tab} />
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <BrowserMockup />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
