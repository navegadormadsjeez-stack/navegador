import { NextResponse } from 'next/server';
import { DOWNLOAD_FILENAME, FALLBACK_DOWNLOAD_URL, fetchDownloadInfo } from '@/lib/download';

export const dynamic = 'force-dynamic';

export async function GET() {
  const info = await fetchDownloadInfo();
  const url = info.downloadUrl || FALLBACK_DOWNLOAD_URL;

  try {
    const upstream = await fetch(url, { cache: 'no-store' });
    if (!upstream.ok || !upstream.body) {
      throw new Error(`Upstream ${upstream.status}`);
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set(
      'Content-Disposition',
      `attachment; filename="${DOWNLOAD_FILENAME}"`,
    );
    const length = upstream.headers.get('content-length');
    if (length) headers.set('Content-Length', length);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.redirect(url, 302);
  }
}
