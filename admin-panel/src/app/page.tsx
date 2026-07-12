import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { ProfilesShowcase } from '@/components/landing/ProfilesShowcase';
import { AiSection } from '@/components/landing/AiSection';
import { DownloadSection } from '@/components/landing/DownloadSection';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ProfilesShowcase />
        <AiSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
