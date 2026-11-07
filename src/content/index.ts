// src/content/index.ts
import { Challenge, CurriculumTrack, Topic, CurriculumMetadata } from '../types/math';
import { CAMBRIDGE_EARLY_YEARS } from './cambridge/early-years';
import { CAMBRIDGE_STAGE_1_TOPICS } from './cambridge/stage-1';

// Topik Cambridge Early Years (10 level dengan ID: cam-ey-01 s/d cam-ey-10)
export const CAMBRIDGE_EARLY_YEARS_TOPICS: Topic[] = [
  {
    id: 'cam-ey-topic-basics',
    title: 'Topik 1: Pengenalan Bilangan 1–10',
    description: 'Membilang visual, subitizing, paritas, dan ikatan bilangan hingga 10.',
    challenges: CAMBRIDGE_EARLY_YEARS,
  },
];

// Topik IB Early Years (5 level dengan ID unik: ib-ey-01 s/d ib-ey-05)
export const IB_EARLY_YEARS_TOPICS: Topic[] = [
  {
    id: 'ib-ey-topic-inquiry',
    title: 'Topik 1: Eksplorasi Kuantitas & Bentuk',
    description: 'Penyelidikan inkuiri terhadap bentuk dan komposisi bilangan awal.',
    challenges: [
      {
        id: 'ib-ey-01',
        moduleCode: 'IB-EY-INQ-01',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-inquiry',
        phase: 'concrete',
        title: 'Misi 1: Menemukan Nilai 3',
        instruction: {
          text: 'Tarik kepingan ke papan kanvas hingga tepat bernilai 3!',
          speechText: 'Tarik kepingan ke papan kanvas hingga tepat bernilai tiga!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping 3 langsung, atau padukan keping 2 dan 1.',
          speechText: 'Gunakan keping tiga langsung, atau padukan keping dua dan satu.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 3 },
        availableTrayPieces: [1, 2, 3],
      },
      {
        id: 'ib-ey-02',
        moduleCode: 'IB-EY-INQ-02',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-inquiry',
        phase: 'concrete',
        title: 'Misi 2: Eksplorasi Kuantitas 4',
        instruction: {
          text: 'Eksplorasi cara berbeda untuk menyusun 4 lubang di atas kanvas!',
          speechText: 'Eksplorasi cara berbeda untuk menyusun empat lubang di atas kanvas!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping 4 langsung, atau dua keping 2 berdampingan.',
          speechText: 'Gunakan keping empat langsung, atau dua keping dua berdampingan.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 4 },
        availableTrayPieces: [1, 2, 3, 4],
      },
      {
        id: 'ib-ey-03',
        moduleCode: 'IB-EY-INQ-03',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-inquiry',
        phase: 'concrete',
        title: 'Misi 3: Eksplorasi Kuantitas 5',
        instruction: {
          text: 'Susun kepingan hingga mencapai jumlah tepat 5 lubang!',
          speechText: 'Susun kepingan hingga mencapai jumlah tepat lima lubang!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Ambil keping 5 merah, atau gabungkan keping 3 dan 2.',
          speechText: 'Ambil keping lima merah, atau gabungkan keping tiga dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 5 },
        availableTrayPieces: [1, 2, 3, 4, 5],
      },
      {
        id: 'ib-ey-04',
        moduleCode: 'IB-EY-PAT-04',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-inquiry',
        phase: 'pictorial',
        title: 'Misi 4: Pasangan Rata Simetris 6',
        instruction: {
          text: 'Pilih keping genap yang memiliki tepi atas rata simetris bernilai 6!',
          speechText: 'Pilih keping genap yang memiliki tepi atas rata simetris bernilai enam!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Keping genap tidak punya ujung ekstra yang menonjol. Ambil keping 6 berwarna cyan.',
          speechText: 'Keping genap tidak punya ujung ekstra yang menonjol. Ambil keping enam berwarna cyan.',
          lang: 'id-ID',
        },
        validation: {
          type: 'parity-check',
          targetTotal: 6,
          requiredParity: 'even',
        },
        availableTrayPieces: [2, 3, 4, 6],
      },
      {
        id: 'ib-ey-05',
        moduleCode: 'IB-EY-INQ-05',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-inquiry',
        phase: 'abstract',
        title: 'Misi 5: Dekomposisi Bilangan 8',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat total 8!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat total delapan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Padukan keping 5 dan 3, atau dua keping 4 yang simetris.',
          speechText: 'Padukan keping lima dan tiga, atau dua keping empat yang simetris.',
          lang: 'id-ID',
        },
        validation: {
          type: 'exact-sum',
          targetTotal: 8,
          minPiecesAllowed: 2,
          maxPiecesAllowed: 2,
        },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
  },
];

// Topik IB PYP 1 (3 level dengan ID unik: ib-pyp1-01 s/d ib-pyp1-03)
export const IB_PYP_1_TOPICS: Topic[] = [
  {
    id: 'ib-pyp1-topic-parity',
    title: 'Topik 1: Eksplorasi Ganjil & Genap',
    description: 'Menemukan pola bilangan berpasangan (genap) dan berpuncak ganjil.',
    challenges: [
      {
        id: 'ib-pyp1-01',
        moduleCode: 'IB-PYP1-PARITY',
        curriculum: 'ib',
        stage: 'PYP 1',
        topicId: 'ib-pyp1-topic-parity',
        phase: 'pictorial',
        title: 'Misi 1: Pasukan Bilangan Genap 8',
        instruction: {
          text: 'Gunakan hanya keping bilangan GENAP (tepi rata tanpa tonjolan) hingga totalnya 8!',
          speechText: 'Gunakan hanya keping bilangan genap yang tepinya rata tanpa tonjolan hingga totalnya delapan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping genap seperti 2, 4, 6, atau 8. Pastikan tidak ada keping ganjil.',
          speechText: 'Gunakan keping genap seperti dua, empat, enam, atau delapan. Pastikan tidak ada keping ganjil.',
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
        topicId: 'ib-pyp1-topic-parity',
        phase: 'pictorial',
        title: 'Misi 2: Pasukan Bilangan Ganjil 7',
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
        topicId: 'ib-pyp1-topic-parity',
        phase: 'abstract',
        title: 'Misi 3: Dekomposisi Kembar Bilangan 10',
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
        availableTrayPieces: [2, 3, 4, 5, 6, 7],
      },
    ],
  },
];

// Metadata Kurikulum
export const CURRICULA_METADATA: Record<CurriculumTrack, CurriculumMetadata> = {
  cambridge: {
    id: 'cambridge',
    name: 'Cambridge International',
    badge: 'Cambridge Primary & Early Years',
    description: 'Pendekatan bertahap terstruktur dari keterampilan dasar hingga aplikasi pemecahan masalah.',
    stages: [
      {
        id: 'Early Years',
        name: 'Cambridge Early Years (K-Level)',
        curriculum: 'cambridge',
        topics: CAMBRIDGE_EARLY_YEARS_TOPICS,
      },
      {
        id: 'Stage 1',
        name: 'Primary Stage 1',
        curriculum: 'cambridge',
        topics: CAMBRIDGE_STAGE_1_TOPICS,
      },
    ],
  },
  ib: {
    id: 'ib',
    name: 'International Baccalaureate',
    badge: 'IB Primary Years Programme (PYP)',
    description: 'Inquiry-based learning berbasis eksplorasi konsep dan pola keterhubungan.',
    stages: [
      {
        id: 'Early Years',
        name: 'IB Early Years (K-Level)',
        curriculum: 'ib',
        topics: IB_EARLY_YEARS_TOPICS,
      },
      {
        id: 'PYP 1',
        name: 'IB PYP Phase 1',
        curriculum: 'ib',
        topics: IB_PYP_1_TOPICS,
      },
    ],
  },
};

// Gabungan seluruh tantangan yang terdaftar (semua ID dijamin unik)
export const ALL_CHALLENGES: Challenge[] = [
  ...CAMBRIDGE_EARLY_YEARS,
  ...CAMBRIDGE_STAGE_1_TOPICS.flatMap((t) => t.challenges),
  ...IB_EARLY_YEARS_TOPICS.flatMap((t) => t.challenges),
  ...IB_PYP_1_TOPICS.flatMap((t) => t.challenges),
];

// Helper functions
export const getTopicsByStage = (curriculum: CurriculumTrack, stageId: string): Topic[] => {
  const stage = CURRICULA_METADATA[curriculum]?.stages.find(
    (s) => s.id.toLowerCase() === stageId.toLowerCase()
  );
  return stage ? stage.topics : [];
};

export const getChallengesByStage = (
  curriculum: CurriculumTrack,
  stageId: string
): Challenge[] => {
  const topics = getTopicsByStage(curriculum, stageId);
  return topics.flatMap((t) => t.challenges);
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return ALL_CHALLENGES.find((c) => c.id === id);
};
