import Link from 'next/link';
import { APP_VERSION } from '@/lib/landing-content';

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-display text-sm font-bold text-brand-foreground">
              M
            </span>
            <span className="font-display text-sm font-semibold text-foreground">
              Madsjeez Seller Browser
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">Versión {APP_VERSION}</p>
        </div>

        <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3" aria-label="Pie de página">
          <Link href="/download" className="text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">
            Descargar
          </Link>
          <Link href="/login" className="text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">
            Admin
          </Link>
          <a href="#seguridad" className="text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">
            Seguridad
          </a>
          <span className="text-muted/60 cursor-default" title="Próximamente">
            Privacidad
          </span>
          <span className="text-muted/60 cursor-default" title="Próximamente">
            Términos
          </span>
          <span className="text-muted/60 cursor-default" title="Próximamente">
            Soporte
          </span>
        </nav>
      </div>

      <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} Madsjeez
      </p>
    </footer>
  );
}
