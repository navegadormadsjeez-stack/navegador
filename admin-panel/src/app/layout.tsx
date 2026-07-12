import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
