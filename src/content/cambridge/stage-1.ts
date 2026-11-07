// src/content/cambridge/stage-1.ts
import { Challenge, Topic } from '../../types/math';

// ============================================================================
// DAFTAR TOPIK PEMBELAJARAN CAMBRIDGE PRIMARY STAGE 1
// ============================================================================

export const CAMBRIDGE_STAGE_1_TOPICS: Topic[] = [
  // --------------------------------------------------------------------------
  // TOPIK 1: Ikatan Bilangan Menuju 10 (Number Bonds to 10)
  // --------------------------------------------------------------------------
  {
    id: 's1-topic-bonds-10',
    title: 'Topik 1: Pasangan Bilangan 10',
    description: 'Menemukan pasangan kombinasi kepingan Numicon untuk membentuk nilai 10.',
    challenges: [
      {
        id: 'cam-s1-01',
        moduleCode: '1Nc.04',
        curriculum: 'cambridge',
        stage: 'Stage 1',
        topicId: 's1-topic-bonds-10',
        phase: 'concrete',
        title: 'Misi 1: Pasangan Bilangan 10',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat angka 10!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat angka sepuluh!',
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
        moduleCode: '1Nc.05',
        curriculum: 'cambridge',
        stage: 'Stage 1',
        topicId: 's1-topic-bonds-10',
        phase: 'pictorial',
        title: 'Misi 2: Kombinasi Tiga Keping Menuju 10',
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
    ],
  },

  // --------------------------------------------------------------------------
  // TOPIK 2: Pola Bilangan Ganjil dan Genap (Odd and Even Numbers)
  // --------------------------------------------------------------------------
  {
    id: 's1-topic-parity',
    title: 'Topik 2: Pola Ganjil & Genap',
    description: 'Mengenal karakteristik bilangan ganjil (berujung tonjolan) dan genap (tepi rata simetris).',
    challenges: [
      {
        id: 'cam-s1-03',
        moduleCode: '1Nc.06',
        curriculum: 'cambridge',
        stage: 'Stage 1',
        topicId: 's1-topic-parity',
        phase: 'pictorial',
        title: 'Misi 1: Pasukan Bilangan Genap 8',
        instruction: {
          text: 'Gunakan hanya keping bilangan GENAP (tepi rata) hingga totalnya tepat 8!',
          speechText: 'Gunakan hanya keping bilangan genap yang tepinya rata hingga totalnya tepat delapan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping genap seperti 2, 4, 6, atau 8. Pastikan tidak ada keping ganjil berujung tonjolan.',
          speechText: 'Gunakan keping genap seperti dua, empat, enam, atau delapan. Pastikan tidak ada keping ganjil berujung tonjolan.',
          lang: 'id-ID',
        },
        validation: {
          type: 'parity-check',
          targetTotal: 8,
          requiredParity: 'even',
        },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 8],
      },
      {
        id: 'cam-s1-04',
        moduleCode: '1Nc.07',
        curriculum: 'cambridge',
        stage: 'Stage 1',
        topicId: 's1-topic-parity',
        phase: 'pictorial',
        title: 'Misi 2: Pasukan Bilangan Ganjil 9',
        instruction: {
          text: 'Gunakan hanya keping bilangan GANJIL (ada lubang ekstra di atas) hingga bernilai 9!',
          speechText: 'Gunakan hanya keping bilangan ganjil yang ada lubang ekstra di atas hingga bernilai sembilan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Keping ganjil adalah keping 1, 3, 5, 7, atau 9. Coba gabungkan keping 5, 3, dan 1.',
          speechText: 'Keping ganjil adalah keping satu, tiga, lima, tujuh, atau sembilan. Coba gabungkan keping lima, tiga, dan satu.',
          lang: 'id-ID',
        },
        validation: {
          type: 'parity-check',
          targetTotal: 9,
          requiredParity: 'odd',
        },
        availableTrayPieces: [1, 2, 3, 4, 5, 7, 9],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // TOPIK 3: Penjumlahan Bilangan Belasan / Melampaui 10 (Teen Numbers)
  // --------------------------------------------------------------------------
  {
    id: 's1-topic-teen-addition',
    title: 'Topik 3: Penjumlahan Melampaui 10',
    description: 'Menyusun bilangan belasan (11–20) dengan dasar 1 keping 10 ditambah keping satuan.',
    challenges: [
      {
        id: 'cam-s1-05',
        moduleCode: '1Nc.08',
        curriculum: 'cambridge',
        stage: 'Stage 1',
        topicId: 's1-topic-teen-addition',
        phase: 'concrete',
        title: 'Misi 1: Membentuk Bilangan 12',
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
        availableTrayPieces: [2, 3, 4, 6, 8, 10],
      },
      {
        id: 'cam-s1-06',
        moduleCode: '1Nc.09',
        curriculum: 'cambridge',
        stage: 'Stage 1',
        topicId: 's1-topic-teen-addition',
        phase: 'abstract',
        title: 'Misi 2: Membentuk Bilangan 15',
        instruction: {
          text: 'Susun kepingan hingga jumlah total lubang di papan bernilai 15!',
          speechText: 'Susun kepingan hingga jumlah total lubang di papan bernilai lima belas!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Ambil keping 10 (biru tua) lalu padukan dengan keping 5 (merah).',
          speechText: 'Ambil keping sepuluh biru tua lalu padukan dengan keping lima merah.',
          lang: 'id-ID',
        },
        validation: {
          type: 'exact-sum',
          targetTotal: 15,
        },
        availableTrayPieces: [3, 4, 5, 7, 8, 10],
      },
    ],
  },
];

// ============================================================================
// EXPORT COMPATIBILITY
// Menggabungkan seluruh tantangan topik ke dalam satu array Challenge[] flat
// ============================================================================
export const CAMBRIDGE_STAGE_1: Challenge[] = CAMBRIDGE_STAGE_1_TOPICS.flatMap(
  (topic) => topic.challenges
);
