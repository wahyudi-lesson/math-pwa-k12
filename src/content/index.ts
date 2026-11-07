// src/content/index.ts
import { Challenge, CurriculumTrack, Topic, CurriculumMetadata } from '../types/math';
import { CAMBRIDGE_EARLY_YEARS } from './cambridge/early-years';
import { CAMBRIDGE_STAGE_1_TOPICS } from './cambridge/stage-1';

// Topik Cambridge Early Years
export const CAMBRIDGE_EARLY_YEARS_TOPICS: Topic[] = [
  {
    id: 'cam-ey-topic-basics',
    title: 'Topik 1: Pengenalan Bilangan 1–10',
    description: 'Membilang visual, subitizing, paritas, dan ikatan bilangan hingga 10.',
    challenges: CAMBRIDGE_EARLY_YEARS,
  },
];

// Topik IB Early Years
export const IB_EARLY_YEARS_TOPICS: Topic[] = [
  {
    id: 'ib-ey-topic-1',
    title: 'Topik 1: Eksplorasi Kuantitas & Simetri',
    description: 'Penyelidikan inkuiri terhadap bentuk dan komposisi bilangan awal.',
    challenges: CAMBRIDGE_EARLY_YEARS.slice(0, 5),
  },
];

// Topik IB PYP 1
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
    ],
  },
];

// Metadata Kurikulum Terpadu
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

// Gabungan seluruh tantangan yang terdaftar (untuk testing & validasi)
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
