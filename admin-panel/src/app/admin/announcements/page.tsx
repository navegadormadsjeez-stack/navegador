export default function AnnouncementsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Anuncios</h1>
          <p className="text-slate-400 mt-1">Notificaciones globales para usuarios del navegador</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Nuevo anuncio
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-start gap-4">
          <span className="text-2xl">📢</span>
          <div>
            <p className="text-white font-medium">Bienvenido a Madsjeez Seller Browser</p>
            <p className="text-slate-400 text-sm mt-1">
              El navegador diseñado para vendedores online de Latinoamérica ya está disponible.
            </p>
            <p className="text-slate-500 text-xs mt-2">Anuncio global · Creado por seed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
