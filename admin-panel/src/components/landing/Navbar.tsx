'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { DownloadButton } from './DownloadButton';

const links = [
  { href: '#features', label: 'Funciones' },
  { href: '#profiles', label: 'Perfiles' },
  { href: '#ai', label: 'IA' },
  { href: '#download', label: 'Descargar' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-yellow to-amber-400 text-[#0a0a0f] font-display font-bold text-lg shadow-lg shadow-brand-yellow/20 group-hover:scale-105 transition-transform">
            M
          </span>
          <span className="font-display font-semibold text-white tracking-tight hidden sm:block">
            Madsjeez
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
          >
            Admin
          </Link>
          <DownloadButton variant="nav" label="Descargar gratis" showIcon={false} />
        </div>

        <button
          type="button"
          className="md:hidden text-zinc-400 hover:text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl px-6 py-4 space-y-1">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-zinc-300 hover:text-white"
            >
              {label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block py-3 text-zinc-400"
          >
            Admin
          </Link>
          <DownloadButton
            variant="primary"
            label="Descargar gratis"
            showIcon={false}
            className="block mt-2 text-center w-full justify-center"
          />
        </div>
      )}
    </header>
  );
}
