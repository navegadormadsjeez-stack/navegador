import { TESTIMONIAL_PLACEHOLDERS } from '@/lib/landing-content';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { FadeIn } from './motion/FadeIn';

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28" aria-label="Opiniones">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-medium text-brand">Opiniones</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Lo que dicen quienes lo usan
          </h2>
          <p className="mt-3 text-sm text-muted">
            Placeholders marcados — reemplazar con testimonios reales verificables.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIAL_PLACEHOLDERS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <Card className="h-full border-dashed border-border-strong">
                <CardHeader>
                  <blockquote className="text-sm leading-relaxed text-muted italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <CardDescription className="mt-4 not-italic">
                    <span className="block font-medium text-foreground">{t.name}</span>
                    {t.role}
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
