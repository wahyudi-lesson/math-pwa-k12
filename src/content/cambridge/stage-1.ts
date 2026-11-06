// src/content/cambridge/stage-1.ts
import { Challenge } from '../../types/math';

export const CAMBRIDGE_STAGE_1: Challenge[] = [
  {
    id: 'cam-s1-01',
    moduleCode: '1Nc.04',
    curriculum: 'cambridge',
    stage: 'Stage 1',
    phase: 'concrete',
    title: 'Ikatan Bilangan Menuju 10',
    instruction: {
      text: 'Gunakan tepat 2 keping Numicon untuk melengkapi angka 10!',
      speechText: 'Gunakan tepat dua keping Numicon untuk melengkapi angka sepuluh!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Pasangkan keping 7 dengan 3, keping 6 dengan 4, atau keping 8 dengan 2.',
      speechText: 'Pasangkan keping tujuh dengan tiga, keping enam dengan empat, atau keping delapan dengan dua.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 10,
      minPiecesAllowed: 2,
      maxPiecesAllowed: 2,
    },
    availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'cam-s1-02',
    moduleCode: '1Nc.06',
    curriculum: 'cambridge',
    stage: 'Stage 1',
    phase: 'pictorial',
    title: 'Kombinasi Tiga Keping Menuju 10',
    instruction: {
      text: 'Gunakan tepat 3 keping Numicon untuk membuat total 10!',
      speechText: 'Gunakan tepat tiga keping Numicon untuk membuat total sepuluh!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Contohnya gabungan keping 5, 3, dan 2, atau keping 4, 4, dan 2.',
      speechText: 'Contohnya gabungan keping lima, tiga, dan dua, atau keping empat, empat, dan dua.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 10,
      minPiecesAllowed: 3,
      maxPiecesAllowed: 3,
    },
    availableTrayPieces: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'cam-s1-03',
    moduleCode: '1Nc.08',
    curriculum: 'cambridge',
    stage: 'Stage 1',
    phase: 'pictorial',
    title: 'Penjumlahan Melampaui 10',
    instruction: {
      text: 'Susun kepingan hingga mencapai nilai 12 di papan!',
      speechText: 'Susun kepingan hingga mencapai nilai dua belas di papan!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Gunakan keping 10 (biru tua) lalu tambahkan keping 2 (biru muda).',
      speechText: 'Gunakan keping sepuluh biru tua lalu tambahkan keping dua biru muda.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 12,
    },
    availableTrayPieces: [2, 4, 6, 8, 10],
  },
];
