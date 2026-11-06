// src/content/cambridge/early-years.ts
import { Challenge } from '../../types/math';

export const CAMBRIDGE_EARLY_YEARS: Challenge[] = [
  {
    id: 'cam-ey-01',
    moduleCode: 'EY-NUM-01',
    curriculum: 'cambridge',
    stage: 'Early Years',
    phase: 'concrete',
    title: 'Mengenal Jumlah 1 sampai 5',
    instruction: {
      text: 'Tarik kepingan ke papan sampai jumlah seluruh lubang tepat bernilai 5!',
      speechText: 'Tarik kepingan ke papan sampai jumlah seluruh lubang tepat bernilai lima!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Kamu bisa menggunakan 1 keping angka 5 (merah), atau gabungan keping 2 dan 3.',
      speechText: 'Kamu bisa menggunakan satu keping angka lima merah, atau gabungan keping dua dan tiga.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 5,
    },
    availableTrayPieces: [1, 2, 3, 4, 5],
  },
  {
    id: 'cam-ey-02',
    moduleCode: 'EY-NUM-02',
    curriculum: 'cambridge',
    stage: 'Early Years',
    phase: 'concrete',
    title: 'Subitizing Pola 6',
    instruction: {
      text: 'Susun kepingan hingga menghasilkan tepat 6 lubang!',
      speechText: 'Susun kepingan hingga menghasilkan tepat enam lubang!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Coba gabungkan dua keping angka 3 (kuning), atau langsung gunakan keping 6 (cyan).',
      speechText: 'Coba gabungkan dua keping angka tiga kuning, atau langsung gunakan keping enam cyan.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 6,
    },
    availableTrayPieces: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'cam-ey-03',
    moduleCode: 'EY-BONDS-05',
    curriculum: 'cambridge',
    stage: 'Early Years',
    phase: 'concrete',
    title: 'Pasangan Bilangan 5',
    instruction: {
      text: 'Gunakan tepat 2 keping Numicon untuk membuat jumlah 5!',
      speechText: 'Gunakan tepat dua keping Numicon untuk membuat jumlah lima!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Cari 2 keping yang jika digabungkan menjadi 5: misalnya 4 dan 1, atau 3 dan 2.',
      speechText: 'Cari dua keping yang jika digabungkan menjadi lima, misalnya empat dan satu, atau tiga dan dua.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 5,
      minPiecesAllowed: 2,
      maxPiecesAllowed: 2,
    },
    availableTrayPieces: [1, 2, 3, 4],
  },
];
