import { NextResponse } from 'next/server';
import { FALLBACK_DOWNLOAD_URL, fetchDownloadInfo } from '@/lib/download';

export const dynamic = 'force-dynamic';

export async function GET() {
  const info = await fetchDownloadInfo();
  const url = info.downloadUrl || FALLBACK_DOWNLOAD_URL;
  return NextResponse.redirect(url, 302);
}
