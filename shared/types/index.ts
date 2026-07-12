export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum AiRequestType {
  ML_TITLE = 'ML_TITLE',
  SEO_DESCRIPTION = 'SEO_DESCRIPTION',
  CUSTOMER_REPLY = 'CUSTOMER_REPLY',
  COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS',
  PAGE_SUMMARY = 'PAGE_SUMMARY',
  FACEBOOK_POST = 'FACEBOOK_POST',
  PRICE_SUGGESTION = 'PRICE_SUGGESTION',
  GENERAL = 'GENERAL',
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  startupUrls: string[];
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  compatibilities: string[];
  attributes: Record<string, unknown>;
  tags: string[];
}

export interface AiRequestPayload {
  type: AiRequestType;
  prompt: string;
  pageUrl?: string;
  pageContent?: string;
  context?: Record<string, unknown>;
}

export interface AppUpdateInfo {
  version: string;
  title: string;
  description: string;
  downloadUrl: string;
  checksum: string;
  fileSize: number;
  isMandatory: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface BrowserProfile {
  id: string;
  name: string;
  slug: string;
  color: string;
  startupUrls: string[];
  cachePath: string;
}

export const DEFAULT_WORKSPACES = {
  maqjeez: {
    name: 'Maqjeez',
    slug: 'maqjeez',
    color: '#FFE600',
    startupUrls: [
      'https://www.mercadolibre.com.ar',
      'https://web.whatsapp.com',
      'https://mail.google.com',
      'https://www.madsjeez.com',
    ],
  },
  materiaNatural: {
    name: 'Materia Natural',
    slug: 'materia-natural',
    color: '#10B981',
    startupUrls: [
      'https://www.instagram.com',
      'https://www.facebook.com',
      'https://web.whatsapp.com',
    ],
  },
} as const;
