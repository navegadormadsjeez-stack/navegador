'use client';

import { FAQ_ITEMS } from '@/lib/landing-content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FadeIn } from './motion/FadeIn';

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeIn className="text-center">
          <p className="text-sm font-medium text-brand">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Preguntas frecuentes
          </h2>
        </FadeIn>

        <FadeIn delay={0.06} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
