'use client';

import type { RefObject } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Bookmark,
  Brain,
  Calculator,
  CheckCircle,
  CheckCircle2,
  Clock,
  CloudCog,
  Crown,
  Download,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  MessageCircle,
  MoreVertical,
  Plus,
  Puzzle,
  RotateCw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  User,
  X,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio', active: true },
  { icon: null, label: 'IA Asistente', ai: true },
  { icon: Send, label: 'Publicar' },
  { icon: LayoutGrid, label: 'Herramientas' },
  { icon: MessageCircle, label: 'Redes Sociales' },
  { icon: Download, label: 'Descargas' },
  { icon: Bookmark, label: 'Marcadores' },
  { icon: Clock, label: 'Historial' },
  { icon: Puzzle, label: 'Extensiones' },
  { icon: Settings, label: 'Ajustes' },
];

const QUICK_LINKS = [
  { label: 'Google', color: 'bg-white', content: <span className="text-blue-600 font-bold text-lg">G</span> },
  { label: 'YouTube', color: 'bg-white', content: <span className="text-red-600 font-bold text-sm">▶</span> },
  {
    label: 'Mercado Libre',
    color: 'bg-yellow-400',
    content: <ShoppingBag className="w-6 h-6 text-blue-900" />,
  },
  { label: 'Facebook', color: 'bg-[#1877F2]', content: <span className="text-white font-bold text-xl">f</span> },
  {
    label: 'Instagram',
    color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600',
    content: <span className="text-white font-bold text-xs">IG</span>,
  },
  { label: 'WhatsApp', color: 'bg-[#25D366]', content: <MessageCircle className="w-6 h-6 text-white" /> },
];

const STATS = [
  { label: 'Tiempo ahorrado', value: '1h 24m', delta: '+28%', icon: Clock, ring: 'border-brand-purple text-brand-purple' },
  { label: 'Bloqueo de rastreadores', value: '126', delta: '+18%', icon: Shield, ring: 'border-brand-cyan text-brand-cyan' },
  { label: 'Anuncios bloqueados', value: '89', delta: '+22%', icon: X, ring: 'border-red-500 text-red-500' },
  { label: 'Datos ahorrados', value: '342 MB', delta: '+31%', icon: null, ring: 'border-emerald-500' },
];

const TOOLS = [
  { label: 'Publicar', icon: Send, color: 'text-brand-blue' },
  { label: 'Calculadora', icon: Calculator, color: 'text-gray-400' },
  { label: 'Convertidor', icon: ArrowLeftRight, color: 'text-brand-cyan' },
  { label: 'Generador IA', icon: Sparkles, color: 'text-brand-purple' },
  { label: 'Editar imágenes', icon: ImageIcon, color: 'text-emerald-400' },
  { label: 'Notas rápidas', icon: FileText, color: 'text-yellow-400' },
];

interface BrowserMockupPremiumProps {
  mockupRef: RefObject<HTMLDivElement>;
  sectionRef: RefObject<HTMLElement>;
}

export function BrowserMockupPremium({ mockupRef, sectionRef }: BrowserMockupPremiumProps) {
  return (
    <section
      ref={sectionRef}
      className="relative z-20 max-w-[1400px] mx-auto px-4 pb-40 perspective-container"
      id="mockup-section"
    >
      <div className="mockup-3d-wrapper w-full relative" ref={mockupRef}>
        <div className="mockup-reflection" aria-hidden />

        <div className="mockup-browser w-full flex flex-col h-[850px]">
          {/* Tab bar + URL */}
          <div className="h-14 bg-[#05060A] border-b border-brand-border flex items-center px-4 gap-4 relative z-20 shrink-0">
            <div className="hidden sm:flex gap-2 w-16 opacity-50">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>

            <div className="flex items-center gap-2 bg-[#0A0B12] border border-brand-border/50 px-4 py-1.5 rounded-t-lg mt-2 min-w-[160px]">
              <CheckCircle className="w-3 h-3 text-brand-cyan" />
              <span className="text-xs text-gray-300 flex-1 truncate">Nueva pestaña</span>
              <X className="w-3 h-3 text-gray-500" />
            </div>
            <Plus className="w-4 h-4 text-gray-500 mt-2 hidden sm:block" />

            <div className="flex-1 max-w-3xl ml-2 sm:ml-8 flex items-center gap-2 sm:gap-4 mt-2 min-w-0">
              <ArrowLeft className="w-4 h-4 text-gray-500 hidden md:block" />
              <ArrowRight className="w-4 h-4 text-gray-600 hidden md:block" />
              <RotateCw className="w-4 h-4 text-gray-500 hidden md:block" />

              <div className="flex-1 bg-[#12141D] border border-brand-border rounded-full h-9 flex items-center px-3 sm:px-4 gap-2 min-w-0">
                <svg width="16" height="16" viewBox="0 0 100 100" fill="none" aria-hidden>
                  <path
                    d="M 25 75 L 35 35 L 50 55 L 65 35 L 75 25"
                    stroke="#00E5FF"
                    strokeWidth="12"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span className="text-[11px] sm:text-[13px] text-gray-500 truncate">
                  Buscar con Madsjeez o ingresar URL
                </span>
                <div className="ml-auto flex gap-2 text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  <Star className="w-4 h-4" />
                </div>
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-400 ml-auto mt-2 hidden sm:block" />
          </div>

          <div className="flex-1 flex overflow-hidden relative z-10 bg-[#0A0B12] min-h-0">
            {/* Sidebar */}
            <div className="hidden lg:flex w-60 bg-[#05060A] border-r border-brand-border flex-col justify-between py-4 shrink-0">
              <div className="px-3 space-y-1 custom-scrollbar overflow-y-auto">
                {NAV_ITEMS.map(({ icon: Icon, label, active, ai }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-default ${
                      active
                        ? 'bg-gradient-to-r from-brand-cyan/20 to-transparent border-l-2 border-brand-cyan text-white rounded-r-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {ai ? (
                      <div className="w-5 h-5 rounded flex items-center justify-center border border-gray-600 text-[10px] font-bold">
                        AI
                      </div>
                    ) : Icon ? (
                      <Icon className={`w-5 h-5 ${active ? 'text-brand-cyan' : ''}`} />
                    ) : null}
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 mt-4 space-y-4">
                <div className="bg-[#12141D] border border-brand-border rounded-xl p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Madsjeez Pro
                  </h4>
                  <p className="text-xs text-gray-400 mb-3">Más productividad, más herramientas.</p>
                  <button type="button" className="w-full py-2 bg-brand-purple hover:bg-brand-purple/80 text-white text-xs font-bold rounded-lg">
                    Activar Ahora
                  </button>
                </div>
                <div className="flex items-center gap-3 border-t border-brand-border pt-4">
                  <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-white">
                    M
                  </div>
                  <p className="text-xs text-white">Sincronizado</p>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                </div>
              </div>
            </div>

            {/* Center - new tab */}
            <div className="flex-1 flex flex-col p-4 sm:p-8 custom-scrollbar overflow-y-auto relative min-w-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-glow pointer-events-none rounded-full blur-3xl" />

              <div className="max-w-4xl mx-auto w-full flex flex-col items-center pt-6 sm:pt-10">
                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl sm:text-5xl font-black tracking-[0.2em] text-white mb-2">
                    MADSJEEZ
                  </h2>
                  <h3 className="font-display text-xs sm:text-sm tracking-[0.4em] text-brand-purple">— B R O W S E R —</h3>
                </div>

                <div className="w-full max-w-2xl border-gradient p-[1px] rounded-2xl mb-6 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                  <div className="bg-[#05060A] rounded-2xl flex items-center px-4 sm:px-6 py-4">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="flex-1 px-4 text-gray-500 text-sm sm:text-lg truncate">
                      Buscar en la web de forma privada...
                    </span>
                    <Sparkles className="w-5 h-5 text-brand-purple shrink-0" />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 sm:mb-14">
                  {[
                    { label: 'Privado', icon: Shield, color: 'text-brand-purple' },
                    { label: 'Rápido', icon: Zap, color: 'text-brand-cyan' },
                    { label: 'Inteligente', icon: Brain, color: 'text-brand-cyan' },
                    { label: 'Tuyo', icon: User, color: 'text-brand-purple' },
                  ].map(({ label, icon: Icon, color }) => (
                    <div
                      key={label}
                      className="px-4 py-1.5 rounded-full border border-brand-border bg-[#12141D] text-xs flex items-center gap-2"
                    >
                      <Icon className={`w-3 h-3 ${color}`} />
                      <span className={color}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-white">Acceso rápido</h3>
                    <button type="button" className="text-xs text-gray-400 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Editar
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
                    {QUICK_LINKS.map(({ label, color, content }) => (
                      <div
                        key={label}
                        className="bg-[#12141D] border border-brand-border rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3"
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-full flex items-center justify-center`}>
                          {content}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-300 text-center">{label}</span>
                      </div>
                    ))}
                    <div className="bg-[#12141D] border border-brand-border border-dashed rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 text-gray-500">
                      <Plus className="w-6 h-6" />
                      <span className="text-[10px] sm:text-xs">Agregar</span>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="text-sm font-semibold text-white mb-4">Estadísticas de hoy</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {STATS.map(({ label, value, delta, icon: Icon, ring }) => (
                      <div key={label} className="bg-[#12141D] border border-brand-border rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-2">{label}</p>
                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="text-lg sm:text-xl font-bold text-white">{value}</p>
                            <p className="text-[10px] text-emerald-400">vs ayer {delta}</p>
                          </div>
                          <div className={`w-8 h-8 rounded-full border-2 ${ring} flex items-center justify-center shrink-0`}>
                            {Icon ? (
                              <Icon className={`w-4 h-4 ${ring.split(' ')[1] ?? ''}`} />
                            ) : (
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="hidden xl:flex w-80 bg-[#05060A] border-l border-brand-border p-4 flex-col gap-6 overflow-y-auto custom-scrollbar shrink-0">
              <div className="bg-[#0A0B12] border border-brand-border rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 blur-3xl rounded-full" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Sparkles className="w-4 h-4 text-brand-cyan" /> Asistente IA
                  </div>
                  <X className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-center mb-6 relative z-10">
                  <p className="text-lg font-medium text-gradient">
                    ¿En qué puedo
                    <br />
                    ayudarte hoy?
                  </p>
                </div>
                <div className="bg-[#12141D] border border-brand-border rounded-xl p-2 flex items-center gap-2 mb-4 relative z-10">
                  <span className="flex-1 text-xs text-gray-500 px-2">Escribe tu consulta...</span>
                  <button type="button" className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 relative z-10">
                  {['Resumir esta página', 'Generar publicación', 'Traducir texto', 'Mejorar imagen'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="py-1.5 px-2 bg-[#12141D] border border-brand-border rounded-lg text-[10px] text-gray-300"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-sm font-semibold text-white">Herramientas rápidas</h3>
                  <button type="button" className="text-[10px] text-gray-400">Ver todas</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {TOOLS.map(({ label, icon: Icon, color }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-[#12141D] border border-brand-border rounded-xl flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <span className="text-[10px] text-gray-400 text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-sm font-semibold text-white mb-3 px-1">Sincronización</h3>
                <div className="bg-[#12141D] border border-brand-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-white font-medium">Sincronizado</p>
                      <p className="text-[10px] text-gray-500">Todos tus datos están seguros</p>
                    </div>
                    <CloudCog className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                  </div>
                  <p className="text-[10px] text-right text-gray-400 font-mono">100%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="h-10 bg-[#05060A] border-t border-brand-border flex items-center px-4 sm:px-6 gap-4 sm:gap-8 z-20 shrink-0 overflow-x-auto">
            {[
              { label: 'RAM', value: '32%', color: '#007BFF', path: 'M0 10 Q 10 5, 20 10 T 40 10 T 60 5' },
              { label: 'CPU', value: '18%', color: '#8A2BE2', path: 'M0 8 Q 5 12, 10 8 T 25 8 T 40 5 T 60 10' },
              { label: 'Red', value: '8%', color: '#00E5FF', path: 'M0 12 L 10 10 L 20 11 L 30 13 L 40 9 L 50 12 L 60 10' },
            ].map(({ label, value, color, path }) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-[10px] text-gray-500 font-mono w-8">{label}</span>
                <span className="text-[10px] text-white font-mono w-6">{value}</span>
                <svg width="60" height="15" className="opacity-70 hidden sm:block">
                  <path d={path} stroke={color} fill="none" strokeWidth="1.5" />
                </svg>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white font-medium leading-tight">Protección activada</span>
                <span className="text-[9px] text-gray-500 leading-tight hidden sm:block">Navegación segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
