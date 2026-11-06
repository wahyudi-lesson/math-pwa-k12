// src/content/ib/pyp-1.ts
import { Challenge } from '../../types/math';

export const IB_PYP_1: Challenge[] = [
  {
    id: 'ib-pyp1-01',
    moduleCode: 'IB-PYP1-PARITY',
    curriculum: 'ib',
    stage: 'PYP 1',
    phase: 'pictorial',
    title: 'Inkuiri Pola Bilangan Ganjil & Genap',
    instruction: {
      text: 'Gunakan hanya keping bilangan GENAP (tepi rata tanpa tonjolan) hingga totalnya 8!',
      speechText: 'Gunakan hanya keping bilangan genap yang tepinya rata tanpa tonjolan hingga totalnya delapan!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Gunakan keping genap seperti 2, 4, 6, atau 8. Jangan masukkan keping dengan lubang ekstra di atas.',
      speechText: 'Gunakan keping genap seperti dua, empat, enam, atau delapan. Jangan masukkan keping dengan lubang ekstra di atas.',
      lang: 'id-ID',
    },
    validation: {
      type: 'parity-check',
      targetTotal: 8,
      requiredParity: 'even',
    },
    availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 'ib-pyp1-02',
    moduleCode: 'IB-PYP1-ODD-01',
    curriculum: 'ib',
    stage: 'PYP 1',
    phase: 'pictorial',
    title: 'Penemuan Keping Ganjil (+1 Tanpa Kawan)',
    instruction: {
      text: 'Susun total nilai 7 hanya menggunakan keping bilangan GANJIL!',
      speechText: 'Susun total nilai tujuh hanya menggunakan keping bilangan ganjil!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Keping ganjil memiliki satu lubang menonjol di atas: 1, 3, 5, atau 7.',
      speechText: 'Keping ganjil memiliki satu lubang menonjol di atas: satu, tiga, lima, atau tujuh.',
      lang: 'id-ID',
    },
    validation: {
      type: 'parity-check',
      targetTotal: 7,
      requiredParity: 'odd',
    },
    availableTrayPieces: [1, 3, 5, 7],
  },
  {
    id: 'ib-pyp1-03',
    moduleCode: 'IB-PYP1-REL-10',
    curriculum: 'ib',
    stage: 'PYP 1',
    phase: 'abstract',
    title: 'Dekomposisi Bilangan 10',
    instruction: {
      text: 'Buktikan bahwa 10 dapat dipecah menjadi 2 keping bernilai sama (Double)!',
      speechText: 'Buktikan bahwa sepuluh dapat dipecah menjadi dua keping bernilai sama!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Gunakan dua keping kembar bernilai 5 (merah).',
      speechText: 'Gunakan dua keping kembar bernilai lima merah.',
      lang: 'id-ID',
    },
    validation: {
      type: 'exact-sum',
      targetTotal: 10,
      minPiecesAllowed: 2,
      maxPiecesAllowed: 2,
    },
    availableTrayPieces: [3, 4, 5, 6, 7],
  },
];
