'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  subscription?: { plan: string; status: string };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchApi<{ users: User[]; total: number }>('/users').then((data) => {
      if (data) {
        setUsers(data.users);
        setTotal(data.total);
      }
    });
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-slate-400 mt-1">{total} usuarios registrados</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Nombre</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Plan</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Estado</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Registro</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No hay usuarios. Ejecuta el seed del backend.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="p-4 text-white">{user.name}</td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                      {user.subscription?.plan ?? 'FREE'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
