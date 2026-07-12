export function BrowserMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-3xl bg-brand/5 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-border bg-background/80 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <div className="mx-3 min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1 text-[11px] text-muted truncate">
            mercadolibre.com.ar/publicaciones
          </div>
          <span className="rounded-md border border-brand/20 bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
            Maqjeez
          </span>
        </div>

        <div className="flex min-h-[220px] sm:min-h-[260px]">
          <aside className="hidden w-36 shrink-0 border-r border-border bg-background/50 p-3 sm:block">
            <p className="text-[10px] uppercase tracking-wider text-muted">Favoritos</p>
            <div className="mt-2 space-y-1.5">
              {['Calzado XL', 'Remera pack'].map((item) => (
                <div
                  key={item}
                  className="truncate rounded-md px-2 py-1 text-[11px] text-muted hover:bg-surface/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
          <main className="flex-1 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Publicaciones activas</p>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                Sincronizado
              </span>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-2"
                >
                  <div className="h-9 w-9 shrink-0 rounded-md bg-surface" />
                  <div className="min-w-0 flex-1">
                    <div className="h-2 w-3/4 rounded bg-surface" />
                    <div className="mt-1.5 h-1.5 w-1/2 rounded bg-surface/80" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
