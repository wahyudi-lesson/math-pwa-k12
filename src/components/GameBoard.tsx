// src/components/GameBoard.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NumiconPiece } from './NumiconPiece';
import { PlacedPiece, NumiconValue, RotationAngle } from '../types/math';
import { playSoundEffect } from '../lib/audio';
import { RotateCw, Trash2, Copy, Sparkles, RefreshCcw } from 'lucide-react';

export interface GameBoardProps {
  initialPieces?: PlacedPiece[];
  availableTrayPieces?: NumiconValue[];
  targetTenFrame?: boolean;
  highlightOddPegs?: boolean;
  onTotalChange?: (total: number, pieces: PlacedPiece[]) => void;
  onPieceSelect?: (piece: PlacedPiece | null) => void;
  className?: string;
}

interface DragState {
  pieceId: string;
  pointerId: number;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  initialPieces = [],
  availableTrayPieces = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  targetTenFrame = false,
  highlightOddPegs = false,
  onTotalChange,
  onPieceSelect,
  className = '',
}) => {
  const [pieces, setPieces] = useState<PlacedPiece[]>(initialPieces);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [nextZIndex, setNextZIndex] = useState<number>(10);

  const boardRef = useRef<HTMLDivElement>(null);

  // Ukuran dasar grid kepingan (1 unit lubang = 44px, snap presisi per 22px / setengah unit)
  const UNIT_SIZE = 44;
  const GRID_SNAP = 22;

  // Sinkronisasi inisialisasi awal kepingan dari luar
  useEffect(() => {
    if (initialPieces.length > 0) {
      setPieces(initialPieces);
      const total = initialPieces.reduce((sum, p) => sum + p.value, 0);
      onTotalChange?.(total, initialPieces);
    }
  }, [initialPieces]);

  // Kalkulasi total lubang aktif di papan permainan
  const triggerTotalUpdate = useCallback(
    (currentPieces: PlacedPiece[]) => {
      const total = currentPieces.reduce((sum, p) => sum + p.value, 0);
      onTotalChange?.(total, currentPieces);
    },
    [onTotalChange]
  );

  // Menambahkan kepingan baru dari palet bawah ke atas papan kanvas
  const handleAddPiece = (value: NumiconValue) => {
    playSoundEffect('snap');

    // Menghitung titik spawn di tengah papan dengan sedikit offset acak
    const boardEl = boardRef.current;
    const boardWidth = boardEl ? boardEl.clientWidth : 600;
    const boardHeight = boardEl ? boardEl.clientHeight : 450;

    const spawnX = Math.round((boardWidth * 0.4 + (pieces.length % 4) * 24) / GRID_SNAP) * GRID_SNAP;
    const spawnY = Math.round((boardHeight * 0.25 + (pieces.length % 4) * 24) / GRID_SNAP) * GRID_SNAP;

    const newPiece: PlacedPiece = {
      id: `piece-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      value,
      x: Math.max(22, spawnX),
      y: Math.max(22, spawnY),
      rotation: 0,
      zIndex: nextZIndex + 1,
    };

    setNextZIndex((prev) => prev + 1);
    const updated = [...pieces, newPiece];
    setPieces(updated);
    setSelectedPieceId(newPiece.id);
    onPieceSelect?.(newPiece);
    triggerTotalUpdate(updated);
  };

  // Rotasi kepingan 90 derajat searah jarum jam
  const handleRotatePiece = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('tap');

    setPieces((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          const nextAngle = ((p.rotation + 90) % 360) as RotationAngle;
          return { ...p, rotation: nextAngle };
        }
        return p;
      });
      triggerTotalUpdate(updated);
      return updated;
    });
  };

  // Duplikasi kepingan yang sedang aktif
  const handleDuplicatePiece = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const source = pieces.find((p) => p.id === id);
    if (!source) return;

    playSoundEffect('snap');
    const duplicated: PlacedPiece = {
      ...source,
      id: `piece-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      x: source.x + GRID_SNAP * 2,
      y: source.y + GRID_SNAP * 2,
      zIndex: nextZIndex + 1,
    };

    setNextZIndex((prev) => prev + 1);
    const updated = [...pieces, duplicated];
    setPieces(updated);
    setSelectedPieceId(duplicated.id);
    onPieceSelect?.(duplicated);
    triggerTotalUpdate(updated);
  };

  // Menghapus kepingan dari papan
  const handleRemovePiece = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('tap');

    setPieces((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      triggerTotalUpdate(updated);
      return updated;
    });

    if (selectedPieceId === id) {
      setSelectedPieceId(null);
      onPieceSelect?.(null);
    }
  };

  // Mengosongkan seluruh papan
  const handleClearBoard = () => {
    if (pieces.length === 0) return;
    playSoundEffect('tap');
    setPieces([]);
    setSelectedPieceId(null);
    onPieceSelect?.(null);
    triggerTotalUpdate([]);
  };

  // Handler Pointer Down: Memulai seretan kepingan
  const handlePointerDown = (piece: PlacedPiece, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Naikkan z-index kepingan yang disentuh ke lapisan paling atas
    const updatedZ = nextZIndex + 1;
    setNextZIndex(updatedZ);

    setPieces((prev) =>
      prev.map((p) => (p.id === piece.id ? { ...p, zIndex: updatedZ } : p))
    );

    setSelectedPieceId(piece.id);
    onPieceSelect?.(piece);

    setDragState({
      pieceId: piece.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: piece.x,
      initialY: piece.y,
    });
  };

  // Global Pointer Move: Menghitung koordinat seret dan snapping real-time
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || dragState.pointerId !== e.pointerId) return;

    const boardEl = boardRef.current;
    if (!boardEl) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    const rawX = dragState.initialX + dx;
    const rawY = dragState.initialY + dy;

    // Snapping ke kisi magnetik terdekat
    const snappedX = Math.round(rawX / GRID_SNAP) * GRID_SNAP;
    const snappedY = Math.round(rawY / GRID_SNAP) * GRID_SNAP;

    // Batas koordinat agar kepingan tetap berada di dalam papan
    const maxX = Math.max(0, boardEl.clientWidth - UNIT_SIZE);
    const maxY = Math.max(0, boardEl.clientHeight - UNIT_SIZE);

    const boundedX = Math.max(0, Math.min(maxX, snappedX));
    const boundedY = Math.max(0, Math.min(maxY, snappedY));

    setPieces((prev) =>
      prev.map((p) =>
        p.id === dragState.pieceId ? { ...p, x: boundedX, y: boundedY } : p
      )
    );
  };

  // Pointer Up: Menuntaskan penempatan kepingan
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || dragState.pointerId !== e.pointerId) return;
    playSoundEffect('snap');
    setDragState(null);
    triggerTotalUpdate(pieces);
  };

  return (
    <div className={`flex flex-col gap-4 select-none ${className}`}>
      {/* 1. Kanvas Papan Permainan Utama */}
      <div
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={() => {
          setSelectedPieceId(null);
          onPieceSelect?.(null);
        }}
        className="relative w-full h-[480px] bg-slate-50 border-2 border-slate-300 rounded-3xl overflow-hidden shadow-inner touch-none cursor-default"
        style={{
          backgroundImage:
            'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px), radial-gradient(circle, #94a3b8 1.8px, transparent 1.8px)',
          backgroundSize: `${GRID_SNAP}px ${GRID_SNAP}px, ${UNIT_SIZE}px ${UNIT_SIZE}px`,
          backgroundPosition: '0 0, 0 0',
        }}
      >
        {/* Panduan Visual Opsional: Bingkai Target Angka 10 (Ten Frame Template) */}
        {targetTenFrame && (
          <div
            className="absolute top-8 left-8 border-4 border-dashed border-blue-300 bg-blue-50/50 rounded-2xl pointer-events-none flex flex-col justify-center items-center"
            style={{
              width: `${UNIT_SIZE * 2}px`,
              height: `${UNIT_SIZE * 5}px`,
            }}
          >
            <span className="text-blue-400 font-extrabold text-sm tracking-wider uppercase opacity-80">
              Target 10
            </span>
          </div>
        )}

        {/* Render Seluruh Kepingan Numicon di Atas Papan */}
        {pieces.map((piece) => {
          const isSelected = selectedPieceId === piece.id;
          const isDragging = dragState?.pieceId === piece.id;

          return (
            <div
              key={piece.id}
              onPointerDown={(e) => handlePointerDown(piece, e)}
              style={{
                left: `${piece.x}px`,
                top: `${piece.y}px`,
                zIndex: piece.zIndex || 1,
              }}
              className={`absolute transition-shadow duration-100 ${
                isDragging ? 'opacity-90 scale-[1.02] cursor-grabbing' : 'cursor-grab'
              }`}
            >
              <div className="relative group">
                <NumiconPiece
                  value={piece.value}
                  rotation={piece.rotation}
                  unitSize={UNIT_SIZE}
                  isSelected={isSelected}
                  highlightOddPeg={highlightOddPegs}
                  showValueBadge
                />

                {/* Toolbar Mengambang Khusus Keping yang Sedang Dipilih */}
                {isSelected && !isDragging && (
                  <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-slate-200 flex items-center gap-1 z-50 animate-in fade-in zoom-in-90 duration-150"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => handleRotatePiece(piece.id, e)}
                      className="p-1.5 hover:bg-slate-100 active:scale-90 text-slate-700 rounded-full transition"
                      title="Putar 90 Derajat"
                      aria-label="Putar kepingan"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDuplicatePiece(piece.id, e)}
                      className="p-1.5 hover:bg-slate-100 active:scale-90 text-slate-700 rounded-full transition"
                      title="Duplikasi Kepingan"
                      aria-label="Gandakan kepingan"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
                    <button
                      onClick={(e) => handleRemovePiece(piece.id, e)}
                      className="p-1.5 hover:bg-red-50 active:scale-90 text-red-600 rounded-full transition"
                      title="Hapus Kepingan"
                      aria-label="Hapus kepingan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Indikator Papan Kosong */}
        {pieces.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none gap-2">
            <Sparkles className="w-8 h-8 text-slate-300" />
            <p className="font-medium text-sm">Papan masih kosong. Ambil kepingan dari bawah!</p>
          </div>
        )}

        {/* Tombol Reset / Bersihkan Papan (Pojok Kanan Atas Kanvas) */}
        {pieces.length > 0 && (
          <button
            onClick={handleClearBoard}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-600 hover:text-red-600 p-2 rounded-xl shadow-sm border border-slate-200 transition backdrop-blur-sm flex items-center gap-1.5 text-xs font-bold"
            title="Bersihkan Semua Kepingan"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Kosongkan Papan</span>
          </button>
        )}
      </div>

      {/* 2. Baki / Palet Kepingan Numicon (Tray) */}
      <div className="bg-slate-100/90 border border-slate-200 p-4 rounded-3xl shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Kotak Kepingan Numicon
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Ketuk keping untuk meletakkannya ke papan
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
          {availableTrayPieces.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleAddPiece(val)}
              className="flex-shrink-0 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center group"
              title={`Tambah Numicon Angka ${val}`}
            >
              <div className="h-16 flex items-center justify-center">
                <NumiconPiece
                  value={val}
                  unitSize={18}
                  showValueBadge={false}
                  className="pointer-events-none group-hover:drop-shadow-sm transition"
                />
              </div>
              <span className="text-xs font-black text-slate-600 mt-1">
                {val}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
