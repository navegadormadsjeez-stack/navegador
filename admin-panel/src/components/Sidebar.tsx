'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Brain,
  Download,
  Megaphone,
  BarChart3,
} from 'lucide-react';
import { clsx } from 'clsx';
import { clearAuth, getEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/plans', label: 'Planes', icon: CreditCard },
  { href: '/admin/ai', label: 'Consumo IA', icon: Brain },
  { href: '/admin/updates', label: 'Versiones', icon: Download },
  { href: '/admin/announcements', label: 'Anuncios', icon: Megaphone },
  { href: '/admin/stats', label: 'Estadísticas', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const email = getEmail();

  function handleLogout() {
    clearAuth();
    router.replace('/login');
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="text-white font-bold text-sm">Madsjeez</h1>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800',
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        {email && <p className="text-slate-400 text-xs truncate">{email}</p>}
        <button
          type="button"
          onClick={handleLogout}
          className="text-slate-500 hover:text-white text-xs"
        >
          Cerrar sesión
        </button>
        <p className="text-slate-500 text-xs">Madsjeez Seller Browser v0.1.0</p>
      </div>
    </aside>
  );
}
