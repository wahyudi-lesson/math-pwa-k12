// src/content/index.ts
import { Challenge, CurriculumTrack } from '../types/math';
import { CAMBRIDGE_EARLY_YEARS } from './cambridge/early-years';
import { CAMBRIDGE_STAGE_1 } from './cambridge/stage-1';
import { IB_EARLY_YEARS } from './ib/early-years';
import { IB_PYP_1 } from './ib/pyp-1';

export interface StageInfo {
  id: string;
  name: string;
  curriculum: CurriculumTrack;
  description: string;
  challengeCount: number;
}

export interface CurriculumMetadata {
  id: CurriculumTrack;
  name: string;
  badge: string;
  description: string;
  stages: StageInfo[];
}

/**
 * Peta seluruh tantangan terdaftar
 */
export const ALL_CHALLENGES: Challenge[] = [
  ...CAMBRIDGE_EARLY_YEARS,
  ...CAMBRIDGE_STAGE_1,
  ...IB_EARLY_YEARS,
  ...IB_PYP_1,
];

/**
 * Metadata kurikulum beserta jenjang yang tersedia
 */
export const CURRICULA_METADATA: Record<CurriculumTrack, CurriculumMetadata> = {
  cambridge: {
    id: 'cambridge',
    name: 'Cambridge International',
    badge: 'Cambridge Primary & Lower Secondary',
    description: 'Pendekatan bertahap terstruktur dari keterampilan dasar hingga aplikasi pemecahan masalah.',
    stages: [
      {
        id: 'Early Years',
        name: 'Cambridge Early Years (K-Level)',
        curriculum: 'cambridge',
        description: 'Membilang visual, subitizing, dan ikatan bilangan 5.',
        challengeCount: CAMBRIDGE_EARLY_YEARS.length,
      },
      {
        id: 'Stage 1',
        name: 'Primary Stage 1',
        curriculum: 'cambridge',
        description: 'Ikatan bilangan 10, penjumlahan, dan operasi konkret.',
        challengeCount: CAMBRIDGE_STAGE_1.length,
      },
    ],
  },
  ib: {
    id: 'ib',
    name: 'International Baccalaureate (IB)',
    badge: 'IB Primary Years Programme (PYP)',
    description: 'Inquiry-based learning berbasis eksplorasi konsep, pola keterhubungan, dan pemahaman relasional.',
    stages: [
      {
        id: 'Early Years',
        name: 'IB Early Years (K-Level)',
        curriculum: 'ib',
        description: 'Inkuiri spasial kuantitas dan eksplorasi bentuk bilangan.',
        challengeCount: IB_EARLY_YEARS.length,
      },
      {
        id: 'PYP 1',
        name: 'PYP Phase 1',
        curriculum: 'ib',
        description: 'Pola ganjil-genap, dekomposisi bilangan, dan simetri.',
        challengeCount: IB_PYP_1.length,
      },
    ],
  },
};

/**
 * Mengambil daftar tantangan berdasarkan kurikulum dan jenjang
 */
export const getChallengesByStage = (
  curriculum: CurriculumTrack,
  stage: string
): Challenge[] => {
  return ALL_CHALLENGES.filter(
    (c) => c.curriculum === curriculum && c.stage.toLowerCase() === stage.toLowerCase()
  );
};

/**
 * Mengambil satu tantangan spesifik berdasarkan ID
 */
export const getChallengeById = (id: string): Challenge | undefined => {
  return ALL_CHALLENGES.find((c) => c.id === id);
};

/**
 * Mengambil tantangan berikutnya dalam jenjang yang sama
 */
export const getNextChallenge = (currentId: string): Challenge | null => {
  const currentIndex = ALL_CHALLENGES.findIndex((c) => c.id === currentId);
  if (currentIndex === -1 || currentIndex === ALL_CHALLENGES.length - 1) {
    return null;
  }

  const next = ALL_CHALLENGES[currentIndex + 1];
  // Pastikan tantangan berikutnya masih dalam kurikulum & jenjang yang sama
  const current = ALL_CHALLENGES[currentIndex];
  if (next.curriculum === current.curriculum && next.stage === current.stage) {
    return next;
  }

  return null;
};
