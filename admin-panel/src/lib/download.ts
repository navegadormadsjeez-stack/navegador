export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://navegador-production.up.railway.app/api/v1';

export const FALLBACK_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL || 'https://files.catbox.moe/duyrzt.zip';

/** Ruta estable: redirige al ZIP más reciente (API o fallback). */
export const DOWNLOAD_ROUTE = '/api/download';

export interface DownloadInfo {
  available: boolean;
  version?: string;
  title?: string;
  description?: string;
  downloadUrl?: string;
  checksum?: string;
  fileSize?: number;
}

export async function fetchDownloadInfo(): Promise<DownloadInfo> {
  try {
    const res = await fetch(`${API_URL}/updates/latest`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API error');
    const data: DownloadInfo = await res.json();
    if (data.available && data.downloadUrl) return data;
  } catch {
    /* use fallback below */
  }
  return {
    available: true,
    version: '0.1.0',
    title: 'Madsjeez Seller Browser MVP',
    downloadUrl: FALLBACK_DOWNLOAD_URL,
    fileSize: 144720011,
  };
}
