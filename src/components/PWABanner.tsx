// src/components/PWABanner.tsx
import React from 'react';
import { usePWA } from '../hooks/usePWA';
import { WifiOff, RefreshCw, X } from 'lucide-react';

export const PWABanner: React.FC = () => {
  const { isOnline, needRefresh, handleUpdate, dismissRefresh } = usePWA();

  return (
    <aside aria-label="Notifikasi Sistem Aplikasi" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {/* 1. Indikator Offline Mode */}
      {!isOnline && (
        <div className="pointer-events-auto bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <WifiOff className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-200">Mode Tanpa Internet</p>
            <p className="text-[11px] text-slate-400">Seluruh simulasi dan materi tetap dapat digunakan secara offline.</p>
          </div>
        </div>
      )}

      {/* 2. Banner Pembaruan Versi Aplikasi Baru */}
      {needRefresh && (
        <div className="pointer-events-auto bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-200">Pembaruan Tersedia</p>
              <p className="text-xs font-medium text-white">Versi baru siap dimuat.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUpdate}
              className="bg-white text-blue-600 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm hover:bg-blue-50 active:scale-95 transition"
            >
              Muat Ulang
            </button>
            <button
              onClick={dismissRefresh}
              className="p-1.5 text-blue-200 hover:text-white rounded-lg transition"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
