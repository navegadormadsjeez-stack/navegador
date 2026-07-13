import { LandingPremiumPage } from '@/components/landing/premium/LandingPremiumPage';
import { fetchDownloadInfo } from '@/lib/download';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const info = await fetchDownloadInfo();
  const version = info.version ?? '0.1.13';

  return <LandingPremiumPage version={version} />;
}
