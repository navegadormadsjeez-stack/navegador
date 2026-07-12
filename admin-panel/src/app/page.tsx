import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { ProductDemo } from '@/components/landing/ProductDemo';
import { Comparison } from '@/components/landing/Comparison';
import { Security } from '@/components/landing/Security';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <BentoFeatures />
        <ProductDemo />
        <Comparison />
        <Security />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
