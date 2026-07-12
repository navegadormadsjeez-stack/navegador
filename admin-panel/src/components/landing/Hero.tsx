import Link from 'next/link';
import { Shield, Zap } from 'lucide-react';
import { BrowserMockup } from './BrowserMockup';
import { DownloadButton } from './DownloadButton';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-yellow/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-6">
              <Zap size={12} className="text-brand-yellow" />
              v0.1.0 — Disponible para Windows
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
              El navegador hecho para{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-amber-300">
                vendedores online
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-lg">
              Perfiles por marca, favoritos sincronizados, IA para respuestas y métricas
              en un solo lugar. Diseñado para MercadoLibre y tu operación diaria.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <DownloadButton variant="primary" label="Descargar gratis" />
              <Link
                href="/download"
                className="inline-flex items-center gap-2 border border-white/15 text-white font-medium px-7 py-3.5 rounded-full hover:bg-white/5 transition-colors"
              >
                Ver requisitos
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-400" />
                Datos en la nube segura
              </span>
              <span className="flex items-center gap-2">
                <span className="text-brand-yellow">⚡</span>
                Perfiles Maqjeez & Materia Natural
              </span>
            </div>
          </div>

          <div className="animate-fade-up animation-delay-200 lg:pl-4">
            <BrowserMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
