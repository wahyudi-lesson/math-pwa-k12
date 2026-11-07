// src/components/InteractiveCanvas.tsx
import { Challenge, InteractionPayload } from '../types/math';
import { GameBoard } from './GameBoard';
import { TenFrameTool } from './interactives/TenFrameTool';
import { Construction } from 'lucide-react';

interface InteractiveCanvasProps {
  challenge: Challenge;
  boardKey: number;
  readOnly?: boolean;
  onStateChange: (payload: InteractionPayload) => void;
}

export function InteractiveCanvas({
  challenge,
  boardKey,
  readOnly = false,
  onStateChange,
}: InteractiveCanvasProps) {
  const interactiveType = challenge.interactiveType || 'numicon';
  const activityMode = challenge.activityMode || 'guided-practice';

  switch (interactiveType) {
    case 'numicon':
      return (
        <GameBoard
          key={boardKey}
          availableTrayPieces={challenge.availableTrayPieces}
          targetTenFrame={challenge.validation.targetTotal === 10}
          highlightOddPegs={challenge.validation.type === 'parity-check'}
          onTotalChange={(total, pieces) => {
            onStateChange({
              totalValue: total,
              placedCount: pieces.length,
              isComplete: pieces.length > 0,
            });
          }}
        />
      );

    case 'ten-frame':
      return (
        <TenFrameTool
          key={boardKey}
          config={challenge.config}
          mode={activityMode}
          readOnly={readOnly}
          onChange={onStateChange}
        />
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Construction className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Alat Interaktif Sedang Disiapkan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Modul manipulatif untuk tipe <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono">{interactiveType}</code> belum diimplementasikan.
            </p>
          </div>
        </div>
      );
  }
}
