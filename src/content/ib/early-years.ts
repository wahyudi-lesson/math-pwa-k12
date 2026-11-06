// src/content/ib/early-years.ts
import { Challenge } from '../../types/math';

export const IB_EARLY_YEARS: Challenge[] = [
  {
    id: 'ib-ey-01',
    moduleCode: 'IB-EY-INQ-01',
    curriculum: 'ib',
    stage: 'Early Years',
    phase: 'concrete',
    title: 'Eksplorasi Bentuk dan Kuantitas 4',
    instruction: {
      text: 'Eksplorasi cara berbeda untuk menyusun 4 lubang di atas kanvas!',
      speechText: 'Eksplorasi cara berbeda untuk menyusun empat lubang di atas kanvas!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Kamu bisa menggunakan keping 4 langsung, atau dua keping 2 yang disandingkan.',
      speechText: 'Kamu bisa menggunakan keping empat langsung, atau dua keping dua yang disandingkan.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 4,
    },
    availableTrayPieces: [1, 2, 3, 4],
  },
  {
    id: 'ib-ey-02',
    moduleCode: 'IB-EY-PAT-02',
    curriculum: 'ib',
    stage: 'Early Years',
    phase: 'pictorial',
    title: 'Menemukan Pasangan Rata (Bilangan Genap)',
    instruction: {
      text: 'Pilih satu keping yang memiliki tepi atas rata dan simetris bernilai 6!',
      speechText: 'Pilih satu keping yang memiliki tepi atas rata dan simetris bernilai enam!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Keping genap tidak punya ujung yang menonjol sendiri. Cari keping 6 berwarna cyan.',
      speechText: 'Keping genap tidak punya ujung yang menonjol sendiri. Cari keping enam berwarna cyan.',
      lang: 'id-ID',
    },
    validation: {
      type: 'parity-check',
      targetTotal: 6,
      requiredParity: 'even',
      maxPiecesAllowed: 1,
    },
    availableTrayPieces: [3, 5, 6, 7],
  },
];
