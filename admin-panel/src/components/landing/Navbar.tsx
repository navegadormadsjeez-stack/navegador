'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/landing-content';
import { DownloadButton } from './DownloadButton';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/75 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-display text-sm font-bold text-brand-foreground">
            M
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground">
            Madsjeez
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <DownloadButton variant="nav" label="Descargar" showIcon={false} />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-4" aria-label="Móvil">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm text-muted last:border-b-0 hover:text-foreground"
              >
                {label}
              </a>
            ))}
            <DownloadButton
              variant="primary"
              label="Descargar gratis"
              className="mt-4 w-full justify-center"
            />
          </nav>
        </div>
      )}
    </header>
  );
}
