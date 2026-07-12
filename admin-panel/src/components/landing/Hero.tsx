'use client';

import { ArrowRight, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_VERSION } from '@/lib/landing-content';
import { FadeIn } from './motion/FadeIn';
import { GridBackground } from './GridBackground';
import { BrowserMockup } from './BrowserMockup';
import { DownloadButton } from './DownloadButton';

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24 pb-16">
      <GridBackground />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <FadeIn className="max-w-xl">
          <Badge className="mb-6">v{APP_VERSION} — Disponible para Windows</Badge>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Navegador para vendedores que operan en marketplaces
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Perfiles por marca, favoritos en la nube, IA integrada y catálogo conectado.
            Menos cambiar de herramienta, más responder y vender.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DownloadButton variant="primary" label="Descargar gratis" />
            <Button variant="secondary" size="lg" asChild>
              <a href="#demo">
                Ver cómo funciona
                <ArrowRight size={16} aria-hidden />
              </a>
            </Button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted sm:text-sm">
            <Monitor size={14} aria-hidden />
            Windows 10/11 x64 · .NET incluido en el instalador
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="lg:justify-self-end">
          <BrowserMockup />
        </FadeIn>
      </div>
    </section>
  );
}
