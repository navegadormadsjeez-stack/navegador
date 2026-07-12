import { Globe, RefreshCw, Shield, Store } from 'lucide-react';
import { TRUST_ITEMS } from '@/lib/landing-content';
import { FadeIn } from './motion/FadeIn';

const ICONS = {
  marketplaces: Store,
  https: Shield,
  chromium: Globe,
  updates: RefreshCw,
} as const;

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface/30" aria-label="Confianza">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map(({ key, label }, i) => {
          const Icon = ICONS[key];
          return (
            <FadeIn key={key} delay={i * 0.04}>
              <div className="flex items-center gap-3 bg-background px-4 py-5 sm:px-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/60 text-brand">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="text-sm text-muted">{label}</span>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
