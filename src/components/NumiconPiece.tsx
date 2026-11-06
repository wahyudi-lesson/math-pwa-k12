// src/components/NumiconPiece.tsx
import React, { useId } from 'react';
import { NumiconValue, RotationAngle } from '../types/math';

/**
 * Palet warna resmi standar Oxford Numicon
 */
export const NUMICON_PALETTE: Record<NumiconValue, { base: string; dark: string; light: string }> = {
  1: { base: '#f97316', dark: '#c2410c', light: '#fb923c' }, // Oranye
  2: { base: '#38bdf8', dark: '#0284c7', light: '#7dd3fc' }, // Biru Muda
  3: { base: '#eab308', dark: '#a16207', light: '#fde047' }, // Kuning
  4: { base: '#a3e635', dark: '#65a30d', light: '#bef264' }, // Hijau Muda
  5: { base: '#ef4444', dark: '#b91c1c', light: '#f87171' }, // Merah
  6: { base: '#06b6d4', dark: '#0e7490', light: '#67e8f9' }, // Cyan / Pirus
  7: { base: '#ec4899', dark: '#be185d', light: '#f472b6' }, // Merah Muda
  8: { base: '#10b981', dark: '#047857', light: '#34d399' }, // Hijau Zamrud
  9: { base: '#8b5cf6', dark: '#6d28d9', light: '#a78bfa' }, // Ungu
  10: { base: '#1e3a8a', dark: '#172554', light: '#3b82f6' }, // Biru Tua
};

export interface NumiconPieceProps {
  value: NumiconValue;
  rotation?: RotationAngle;
  unitSize?: number;            // Ukuran standar 1 grid lubang (default: 44px)
  highlightOddPeg?: boolean;    // Menyorot lubang ganjil ekstra untuk materi parity
  showValueBadge?: boolean;     // Menampilkan lencana angka kecil di tengah
  isGhost?: boolean;            // Tampilan transparan untuk slot target
  isSelected?: boolean;         // Efek glow saat keping sedang aktif
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  className?: string;
}

export const NumiconPiece: React.FC<NumiconPieceProps> = ({
  value,
  rotation = 0,
  unitSize = 44,
  highlightOddPeg = false,
  showValueBadge = false,
  isGhost = false,
  isSelected = false,
  onClick,
  onPointerDown,
  className = '',
}) => {
  const instanceId = useId().replace(/:/g, '');
  const maskId = `numicon-mask-${instanceId}`;
  const gradientId = `numicon-grad-${instanceId}`;

  const U = unitSize;
  const R = Math.round(U * 0.28);          // Radius lengkung sudut luar (12px)
  const HOLE_R = Math.round(U * 0.31);     // Radius lubang (13.6px)
  const FILLET = Math.round(U * 0.14);     // Lengkungan sudut dalam (concave) untuk ganjil

  const isOdd = value % 2 !== 0;
  const pairs = Math.floor(value / 2);
  const totalRows = isOdd ? pairs + 1 : pairs;

  // Dimensi fisik SVG kanvas keping
  const width = value === 1 ? U : 2 * U;
  const height = totalRows * U;

  // Koordinat titik tengah seluruh lubang
  const holes: { cx: number; cy: number; isSinglePeg: boolean }[] = [];

  if (value === 1) {
    holes.push({ cx: U * 0.5, cy: U * 0.5, isSinglePeg: true });
  } else {
    // Jika ganjil, baris teratas (row 0) hanya memiliki 1 lubang di kolom kiri
    if (isOdd) {
      holes.push({ cx: U * 0.5, cy: U * 0.5, isSinglePeg: true });
    }

    // Lubang berpasangan (2 kolom) untuk baris berikutnya
    const startRow = isOdd ? 1 : 0;
    for (let r = 0; r < pairs; r++) {
      const cy = (startRow + r) * U + U * 0.5;
      holes.push({ cx: U * 0.5, cy, isSinglePeg: false });
      holes.push({ cx: U * 1.5, cy, isSinglePeg: false });
    }
  }

  /**
   * Menghasilkan path SVG presisi untuk badan kepingan.
   * Keping ganjil (>1) memiliki notch berundak dengan sudut dalam yang halus.
   */
  const renderBodyPath = (): string => {
    if (value === 1) {
      return `
        M 0,${R}
        A ${R},${R} 0 0 1 ${R},0
        H ${U - R}
        A ${R},${R} 0 0 1 ${U},${R}
        V ${U - R}
        A ${R},${R} 0 0 1 ${U - R},${U}
        H ${R}
        A ${R},${R} 0 0 1 0,${U - R}
        Z
      `;
    }

    if (!isOdd) {
      return `
        M 0,${R}
        A ${R},${R} 0 0 1 ${R},0
        H ${2 * U - R}
        A ${R},${R} 0 0 1 ${2 * U},${R}
        V ${height - R}
        A ${R},${R} 0 0 1 ${2 * U - R},${height}
        H ${R}
        A ${R},${R} 0 0 1 0,${height - R}
        Z
      `;
    }

    // Bentuk berundak untuk angka ganjil (3, 5, 7, 9)
    return `
      M 0,${R}
      A ${R},${R} 0 0 1 ${R},0
      H ${U - R}
      A ${R},${R} 0 0 1 ${U},${R}
      V ${U - FILLET}
      A ${FILLET},${FILLET} 0 0 0 ${U + FILLET},${U}
      H ${2 * U - R}
      A ${R},${R} 0 0 1 ${2 * U},${U + R}
      V ${height - R}
      A ${R},${R} 0 0 1 ${2 * U - R},${height}
      H ${R}
      A ${R},${R} 0 0 1 0,${height - R}
      Z
    `;
  };

  const colors = NUMICON_PALETTE[value];
  const oddHole = holes.find((h) => h.isSinglePeg);

  return (
    <div
      role="img"
      aria-label={`Numicon angka ${value}, nilai ${value}, bilangan ${isOdd ? 'ganjil' : 'genap'}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
      className={`relative inline-block select-none transition-transform duration-150 ease-out ${
        isGhost ? 'opacity-40 pointer-events-none' : 'cursor-grab active:cursor-grabbing'
      } ${isSelected ? 'filter drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]' : ''} ${className}`}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)]"
      >
        <defs>
          {/* Masking: Mengukir lubang-lubang tembus pandang ke dalam badan plastik */}
          <mask id={maskId}>
            <path d={renderBodyPath()} fill="#ffffff" />
            {holes.map((h, i) => (
              <circle key={`mask-hole-${i}`} cx={h.cx} cy={h.cy} r={HOLE_R} fill="#000000" />
            ))}
          </mask>

          {/* Gradien plastik autentik */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="60%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.dark} />
          </linearGradient>
        </defs>

        {/* 1. Badan Kepingan Bermasker */}
        <path
          d={renderBodyPath()}
          fill={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
        />

        {/* 2. Pinggiran Tepi Keping (Highlight Cahaya Halus) */}
        <path
          d={renderBodyPath()}
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.5"
          className="pointer-events-none"
        />

        {/* 3. Detail Kedalaman Fisik Lubang (Inner Bevel Rims) */}
        {holes.map((h, i) => (
          <g key={`hole-rim-${i}`} className="pointer-events-none">
            {/* Bayangan atas lubang (kedalaman plastik) */}
            <circle
              cx={h.cx}
              cy={h.cy}
              r={HOLE_R}
              fill="none"
              stroke={colors.dark}
              strokeWidth="2.5"
              strokeOpacity="0.75"
            />
            {/* Kilau pantulan cahaya di sisi bawah lubang */}
            <path
              d={`
                M ${h.cx - HOLE_R},${h.cy}
                A ${HOLE_R},${HOLE_R} 0 0 0 ${h.cx + HOLE_R},${h.cy}
              `}
              fill="none"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1.2"
            />
          </g>
        ))}

        {/* 4. Animasi Sorot Lubang Ganjil (+1 Tanpa Pasangan) */}
        {highlightOddPeg && isOdd && oddHole && (
          <g className="pointer-events-none">
            <circle
              cx={oddHole.cx}
              cy={oddHole.cy}
              r={HOLE_R + 5}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray="4 3"
              className="animate-spin"
              style={{ animationDuration: '6s', transformOrigin: `${oddHole.cx}px ${oddHole.cy}px` }}
            />
            <circle
              cx={oddHole.cx}
              cy={oddHole.cy}
              r={HOLE_R + 8}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              className="animate-ping opacity-60"
            />
          </g>
        )}
      </svg>

      {/* Lencana Angka Opsional untuk Kemudahan Pengenalan Awal */}
      {showValueBadge && (
        <span
          className="absolute bottom-1 right-1 bg-white/90 text-slate-800 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow pointer-events-none"
          style={{ transform: `rotate(-${rotation}deg)` }}
        >
          {value}
        </span>
      )}
    </div>
  );
};
