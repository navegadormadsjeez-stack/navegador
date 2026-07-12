import { LandingPremiumPage } from '@/components/landing/premium/LandingPremiumPage';
import { fetchDownloadInfo } from '@/lib/download';

export default async function HomePage() {
  const info = await fetchDownloadInfo();
  const version = info.version ?? '0.1.7';

  return <LandingPremiumPage version={version} />;
}
