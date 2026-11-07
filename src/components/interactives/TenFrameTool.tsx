// src/components/interactives/TenFrameTool.tsx
import { useState, useEffect, useCallback } from 'react';
import { InteractionPayload, ActivityMode } from '../../types/math';
import { playSoundEffect } from '../../lib/audio';
import { RotateCcw, Info, Lock } from 'lucide-react';

interface TenFrameConfig {
  initialRed?: number;
  initialYellow?: number;
  maxSlots?: number;         // 10 untuk Single Ten-Frame, 20 untuk Double Ten-Frame
  lockedInitial?: boolean;    // Koin bawaan terkunci dan tidak bisa dihapus siswa
  allowedColors?: ('red' | 'yellow')[];
}

interface TenFrameToolProps {
  config?: TenFrameConfig;
  mode?: ActivityMode;
  readOnly?: boolean;
  onChange: (payload: InteractionPayload) => void;
}

interface SlotState {
  color: 'red' | 'yellow' | null;
  isLocked: boolean;
}

export function TenFrameTool({
  config = {},
  mode = 'guided-practice',
  readOnly = false,
  onChange,
}: TenFrameToolProps) {
  const maxSlots = config.maxSlots || 10;
  const initialRed = config.initialRed || 0;
  const initialYellow = config.initialYellow || 0;
  const lockedInitial = config.lockedInitial ?? false;
  const allowedColors = config.allowedColors || ['red', 'yellow'];

  // Inisialisasi slot bingkai 10
  const initializeSlots = useCallback((): SlotState[] => {
    const slotsArr: SlotState[] = Array.from({ length: maxSlots }, () => ({
      color: null,
      isLocked: false,
    }));

    for (let i = 0; i < initialRed && i < maxSlots; i++) {
      slotsArr[i] = { color: 'red', isLocked: lockedInitial };
    }
    for (let j = 0; j < initialYellow && initialRed + j < maxSlots; j++) {
      slotsArr[initialRed + j] = { color: 'yellow', isLocked: lockedInitial };
    }

    return slotsArr;
  }, [maxSlots, initialRed, initialYellow, lockedInitial]);

  const [slots, setSlots] = useState<SlotState[]>(initializeSlots);
  const [activeColor, setActiveColor] = useState<'red' | 'yellow'>(allowedColors[0] || 'red');

  // Reset slot jika konfigurasi soal berganti
  useEffect(() => {
    setSlots(initializeSlots());
  }, [initializeSlots]);

  // Sinkronisasi data ke evaluator setiap kali ada interaksi
  useEffect(() => {
    const redCount = slots.filter((s) => s.color === 'red').length;
    const yellowCount = slots.filter((s) => s.color === 'yellow').length;
    const total = redCount + yellowCount;

    onChange({
      totalValue: total,
      placedCount: total,
      counterDistribution: {
        colorA: redCount,
        colorB: yellowCount,
      },
      isComplete: total === maxSlots,
    });
  }, [slots, maxSlots, onChange]);

  // Handler klik / ketuk pada slot kotak
  const handleSlotClick = (index: number) => {
    if (readOnly) return;

    const currentSlot = slots[index];
    if (currentSlot.isLocked) {
      playSoundEffect('wrong');
      return;
    }

    setSlots((prev) => {
      const updated = [...prev];
      if (updated[index].color === null) {
        playSoundEffect('snap');
        updated[index] = { color: activeColor, isLocked: false };
      } else {
        playSoundEffect('tap');
        updated[index] = { color: null, isLocked: false };
      }
      return updated;
    });
  };

  // Reset hanya koin yang tidak terkunci
  const handleClearUnlocked = () => {
    playSoundEffect('tap');
    setSlots((prev) =>
      prev.map((slot) => (slot.isLocked ? slot : { color: null, isLocked: false }))
    );
  };

  const totalPlaced = slots.filter((s) => s.color !== null).length;
  const emptySlotsCount = maxSlots - totalPlaced;

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-50/80 p-4 sm:p-6 rounded-3xl border border-slate-200/90 w-full max-w-xl mx-auto shadow-inner select-none">
      {/* 1. Petunjuk Khusus Mode Eksplorasi / Latihan */}
      {mode === 'exploration' && (
        <div className="flex items-center gap-2 text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-3.5 py-2 rounded-2xl w-full">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Eksplorasi Bebas: Ketuk kotak untuk meletakkan koin. Amati ruang kosong yang tersisa!</span>
        </div>
      )}

      {/* 2. Bingkai Ten-Frame (5 Kolom x 2 Baris per Unit 10) */}
      <div className="flex flex-col gap-3 w-full items-center">
        {Array.from({ length: Math.ceil(maxSlots / 10) }).map((_, frameIdx) => (
          <div
            key={frameIdx}
            className="grid grid-cols-5 gap-2 sm:gap-3 bg-white p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border-4 border-slate-700 shadow-md touch-manipulation"
          >
            {slots.slice(frameIdx * 10, (frameIdx + 1) * 10).map((slot, idx) => {
              const actualIdx = frameIdx * 10 + idx;
              return (
                <button
                  key={actualIdx}
                  type="button"
                  disabled={readOnly || slot.isLocked}
                  onClick={() => handleSlotClick(actualIdx)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center transition-all ${
                    slot.isLocked
                      ? 'border-slate-300 bg-slate-100/80 cursor-not-allowed'
                      : slot.color === null
                      ? 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/60 active:scale-95 cursor-pointer'
                      : 'border-slate-300 bg-slate-50 active:scale-95 cursor-pointer'
                  }`}
                  aria-label={`Slot ${actualIdx + 1}, ${slot.color ? `koin ${slot.color}` : 'kosong'}`}
                >
                  {slot.color ? (
                    <div
                      className={`relative w-9 h-9 sm:w-13 sm:h-13 rounded-full shadow-md transition-transform duration-200 animate-in zoom-in-75 ${
                        slot.color === 'red'
                          ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 border-2 border-red-700 shadow-red-500/30'
                          : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-2 border-amber-600 shadow-amber-500/30'
                      }`}
                    >
                      {/* Titik Pantul Cahaya Koin */}
                      <div className="absolute top-1 left-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/40" />
                      {slot.isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/90">
                          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-sm" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300 select-none">
                      {actualIdx + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Panel Bawah: Monitor Nilai, Pemilih Warna Koin & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full px-1 pt-1">
        {/* Indikator Hitungan Ringkas */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <span>Terisi:</span>
            <span className="text-blue-600 font-black">{totalPlaced}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">{maxSlots}</span>
          </div>

          {mode !== 'assessment' && (
            <div className="text-[11px] font-semibold text-slate-400 hidden sm:block">
              Sisa kosong: <span className="text-slate-600 font-bold">{emptySlotsCount}</span>
            </div>
          )}
        </div>

        {/* Pemilihan Warna Koin Interaktif */}
        {!readOnly && (
          <div className="flex items-center gap-2">
            {allowedColors.length > 1 && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 mr-0.5">Koin:</span>
                {allowedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      playSoundEffect('tap');
                      setActiveColor(color);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-transform active:scale-90 ${
                      color === 'red'
                        ? 'bg-red-500 border border-red-700'
                        : 'bg-amber-400 border border-amber-600'
                    } ${
                      activeColor === color
                        ? 'ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-xs'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    title={`Pilih koin ${color === 'red' ? 'merah' : 'kuning'}`}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleClearUnlocked}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition shadow-2xs active:scale-95"
              title="Bersihkan koin yang kamu pasang"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Hapus</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
