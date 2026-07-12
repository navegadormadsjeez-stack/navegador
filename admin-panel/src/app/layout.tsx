import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Montserrat } from 'next/font/google';
import './globals.css';
import '../styles/landing-premium.css';

const display = Montserrat({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '700', '800', '900'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Madsjeez Browser — Rápido. Inteligente. Tuyo.',
  description:
    'El navegador definitivo para vendedores online. Bloqueo de rastreadores, herramientas de productividad e IA integrada en cada pestaña.',
  openGraph: {
    title: 'Madsjeez Browser',
    description: 'Rápido. Inteligente. Tuyo.',
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
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable} scroll-smooth dark`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
