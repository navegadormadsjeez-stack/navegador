import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Madsjeez Seller Browser — El navegador para vendedores online',
  description:
    'Navegador con perfiles por marca, favoritos sincronizados e IA integrada. Diseñado para vendedores en MercadoLibre y marketplaces.',
  openGraph: {
    title: 'Madsjeez Seller Browser',
    description: 'El navegador hecho para vendedores online',
    type: 'website',
    images: ['/brand/app-icon.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/brand/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
