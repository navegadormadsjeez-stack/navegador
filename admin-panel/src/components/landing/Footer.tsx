import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow text-[#0a0a0f] font-display font-bold text-sm">
              M
            </span>
            <div>
              <p className="font-display font-semibold text-white text-sm">
                Madsjeez Seller Browser
              </p>
              <p className="text-zinc-600 text-xs">v0.1.0</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <a href="#features" className="hover:text-white transition-colors">
              Funciones
            </a>
            <Link href="/download" className="hover:text-white transition-colors">
              Descargar
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Admin
            </Link>
          </nav>

          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Madsjeez
          </p>
        </div>
      </div>
    </footer>
  );
}
