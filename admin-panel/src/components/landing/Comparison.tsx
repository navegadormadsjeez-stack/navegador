import { Check, Minus } from 'lucide-react';
import { COMPARISON_ROWS } from '@/lib/landing-content';
import { FadeIn } from './motion/FadeIn';

function Cell({ value }: { value: boolean }) {
  return value ? (
    <Check className="mx-auto h-4 w-4 text-brand" aria-label="Sí" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted" aria-label="No" />
  );
}

export function Comparison() {
  return (
    <section id="comparacion" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-medium text-brand">Comparación</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Qué incluye hoy Madsjeez Seller Browser
          </h2>
          <p className="mt-3 text-sm text-muted">
            Solo características verificables en la versión actual. Sin porcentajes inventados.
          </p>
        </FadeIn>

        <FadeIn delay={0.06} className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparación entre Madsjeez Seller Browser, Chrome y Brave
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-3 pr-4 font-medium text-muted">
                  Característica
                </th>
                <th scope="col" className="px-4 py-3 text-center font-medium text-foreground">
                  Madsjeez
                </th>
                <th scope="col" className="px-4 py-3 text-center font-medium text-muted">
                  Chrome
                </th>
                <th scope="col" className="px-4 py-3 text-center font-medium text-muted">
                  Brave
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-border/70">
                  <th scope="row" className="py-3.5 pr-4 font-normal text-foreground">
                    {row.feature}
                  </th>
                  <td className="px-4 py-3.5 text-center">
                    <Cell value={row.madsjeez} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Cell value={row.chrome} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Cell value={row.brave} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>
      </div>
    </section>
  );
}
