import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Madsjeez Admin Panel',
  description: 'Panel administrativo de Madsjeez Seller Browser',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-950 text-white">{children}</body>
    </html>
  );
}
