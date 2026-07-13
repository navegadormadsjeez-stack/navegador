export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://navegador-production.up.railway.app/api/v1';

export const FALLBACK_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL ||
  'https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.10/MadsjeezSellerBrowserSetup.exe';

export const DOWNLOAD_FILENAME = 'MadsjeezSellerBrowserSetup.exe';

/** Deriva el nombre de archivo según la URL real (evita servir un .zip como .exe). */
export function resolveDownloadFilename(url: string): string {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.endsWith('.zip')) return 'MadsjeezSellerBrowserSetup.zip';
  } catch {
    /* ignore invalid URL */
  }
  return DOWNLOAD_FILENAME;
}

/** Ruta estable: redirige al instalador .exe más reciente (API o fallback). */
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

/** Catbox solo aceptaba ZIP; URLs viejas apuntaban a un .zip renombrado como .exe. */
function isLegacyZipDownload(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return url.includes('catbox.moe') || path.endsWith('.zip');
  } catch {
    return true;
  }
}

export async function fetchDownloadInfo(): Promise<DownloadInfo> {
  try {
    const res = await fetch(`${API_URL}/updates/latest`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API error');
    const data: DownloadInfo = await res.json();
    if (data.available && data.downloadUrl && !isLegacyZipDownload(data.downloadUrl)) {
      return data;
    }
  } catch {
    /* use fallback below */
  }
  return {
    available: true,
    version: '0.1.10',
    title: 'Madsjeez Seller Browser v0.1.10',
    downloadUrl: FALLBACK_DOWNLOAD_URL,
    fileSize: 155414269,
  };
}
