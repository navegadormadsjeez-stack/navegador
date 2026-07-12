'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DOWNLOAD_FILENAME, DOWNLOAD_ROUTE } from '@/lib/download';

const FAKE_LOGS = [
  '> Conectando a servidores Madsjeez...',
  '> Descargando motor de renderizado basado en Chromium...',
  '> Desencriptando bóveda local...',
  '> Inicializando módulo de Inteligencia Artificial...',
  '> Aplicando capa de privacidad y bloqueo de rastreadores...',
  '> Sincronizando accesos directos (Mercado Libre, Meta)...',
  '> Optimizando uso de RAM y CPU...',
  '> Sistema listo para ejecución.',
];

interface InstallHUDProps {
  open: boolean;
  onClose: () => void;
}

export function InstallHUD({ open, onClose }: InstallHUDProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('SECUENCIA_DE_INICIO');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const reset = useCallback(() => {
    setProgress(0);
    setLogs([]);
    setStatus('SECUENCIA_DE_INICIO');
    setDone(false);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let currentProgress = 0;
    let logIndex = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += Math.random() * 8;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      if (currentProgress > logIndex * (100 / FAKE_LOGS.length) && logIndex < FAKE_LOGS.length) {
        setLogs((prev) => [...prev, FAKE_LOGS[logIndex]]);
        logIndex++;
      }

      if (currentProgress >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus('DESCARGA LISTA');
        setDone(true);
        setLogs((prev) => [...prev, '> Listo. Iniciando descarga del instalador...']);
      }
    }, 250);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, reset]);

  const handleLaunch = () => {
    const link = document.createElement('a');
    link.href = DOWNLOAD_ROUTE;
    link.download = DOWNLOAD_FILENAME;
    link.click();
    onClose();
  };

  return (
    <div className={`hud-overlay ${open ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Descarga">
      <div
        className={`w-full max-w-2xl px-4 transition-transform duration-500 ${open ? 'scale-100' : 'scale-95'}`}
      >
        <div className="bg-[#0A0B12] border border-brand-purple/30 shadow-[0_0_80px_rgba(138,43,226,0.15)] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand" />

          <div className="text-center mb-8">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" className="mx-auto mb-4 animate-pulse-slow">
              <path
                d="M 50 10 A 40 40 0 1 0 90 50"
                stroke="#00E5FF"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M 25 75 L 35 35 L 50 55 L 65 35 L 75 25"
                stroke="#8A2BE2"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <h3 className="font-display text-2xl font-bold text-white mb-1 tracking-wider uppercase">
              Inicializando Madsjeez
            </h3>
            <p
              className="text-xs font-mono"
              style={{ color: done ? '#8A2BE2' : '#00E5FF' }}
            >
              {status}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#030408] border border-white/5 rounded-lg p-4 h-36 overflow-hidden font-mono text-[10px] text-gray-400 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030408] pointer-events-none z-10" />
              <div className="space-y-1 relative z-0 flex flex-col justify-end h-full">
                {logs.map((log, i) => (
                  <div key={i} className={i === logs.length - 1 && done ? 'text-brand-cyan' : undefined}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-2">
                <span>EXTRAYENDO_MODULOS_CORE</span>
                <span className="text-brand-cyan">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-[#030408] rounded-full overflow-hidden">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={done ? handleLaunch : onClose}
            className={`mt-8 w-full py-3 border text-white font-mono text-sm rounded-lg transition-opacity duration-300 ${
              done
                ? 'bg-gradient-brand border-transparent hover:opacity-90 opacity-100 pointer-events-auto'
                : 'bg-white/5 hover:bg-white/10 border-white/10 opacity-70 pointer-events-auto'
            }`}
          >
            {done ? '[ DESCARGAR INSTALADOR ]' : '[ CANCELAR ]'}
          </button>
        </div>
      </div>
    </div>
  );
}
