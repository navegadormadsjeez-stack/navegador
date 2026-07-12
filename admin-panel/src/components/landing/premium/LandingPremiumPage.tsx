'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { MadsjeezLogo } from './MadsjeezLogo';
import { BrowserMockupPremium } from './BrowserMockupPremium';
import { InstallHUD } from './InstallHUD';

interface LandingPremiumPageProps {
  version: string;
}

export function LandingPremiumPage({ version }: LandingPremiumPageProps) {
  const [hudOpen, setHudOpen] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (glowRef.current) {
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
    }

    const section = sectionRef.current;
    const mockup = mockupRef.current;
    if (!section || !mockup) return;

    const rect = section.getBoundingClientRect();
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - cx) / (rect.width / 2)) * 6;
    const rotateX = -((e.clientY - cy) / (rect.height / 2)) * 6 + 8;
    mockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.98)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (mockupRef.current) {
      mockupRef.current.style.transform = 'rotateX(8deg) rotateY(0deg) scale(0.95)';
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return (
    <div className="landing-premium min-h-screen antialiased selection:bg-brand-cyan selection:text-black">
      <div className="cursor-glow" ref={glowRef} aria-hidden />

      <nav className="fixed top-6 w-full z-50 px-6 flex justify-center">
        <div className="bg-brand-panel/60 backdrop-blur-xl border border-brand-border rounded-full h-16 w-full max-w-6xl flex items-center justify-between px-6 shadow-2xl shadow-brand-purple/5">
          <MadsjeezLogo />

          <div className="hidden md:flex items-center gap-8">
            <a href="#mockup-section" className="text-sm font-medium text-gray-300 hover:text-brand-cyan transition-colors">
              Características
            </a>
            <a href="#mockup-section" className="text-sm font-medium text-gray-300 hover:text-brand-cyan transition-colors">
              Seguridad
            </a>
            <span className="text-sm font-medium text-brand-cyan flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> IA Integrada
            </span>
          </div>

          <button
            type="button"
            onClick={() => setHudOpen(true)}
            className="relative px-5 sm:px-6 py-2.5 bg-gradient-brand text-white text-sm font-bold rounded-full overflow-hidden transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="hidden sm:inline">Descargar</span>
              <Download className="w-4 h-4" />
            </span>
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-36 sm:pt-44 pb-16 flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
          </span>
          <span className="text-[11px] font-mono font-medium text-brand-cyan uppercase tracking-widest">
            v{version} · Windows
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-[5rem] font-black tracking-tight leading-[1.1] max-w-4xl mb-6 text-white drop-shadow-2xl">
          El navegador definitivo.
          <br />
          <span className="text-gradient">Rápido. Inteligente. Tuyo.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mb-10 font-medium leading-relaxed">
          Revoluciona tu forma de navegar. Bloqueo de rastreadores nativo, herramientas de productividad
          integradas y tu propio asistente de Inteligencia Artificial en cada pestaña.
        </p>

        <button
          type="button"
          onClick={() => setHudOpen(true)}
          className="px-8 py-3 bg-gradient-brand text-white font-bold rounded-full shadow-[0_0_30px_rgba(0,229,255,0.25)] hover:scale-105 transition-transform"
        >
          Descargar gratis para Windows
        </button>
      </main>

      <BrowserMockupPremium mockupRef={mockupRef} sectionRef={sectionRef} />

      <footer className="relative z-10 border-t border-brand-border py-10 text-center text-sm text-gray-500">
        <p className="mb-2 font-display tracking-widest text-gray-400">MADSJEEZ BROWSER</p>
        <p>© {new Date().getFullYear()} Madsjeez · Navegador para vendedores online</p>
      </footer>

      <InstallHUD open={hudOpen} onClose={() => setHudOpen(false)} />
    </div>
  );
}
