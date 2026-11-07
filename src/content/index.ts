// src/content/index.ts
import { Challenge, CurriculumTrack, Topic } from '../types/math';
import { CAMBRIDGE_EARLY_YEARS } from './cambridge/early-years';
import { CAMBRIDGE_STAGE_1_TOPICS } from './cambridge/stage-1';
// Import grade lainnya di sini:
// import { CAMBRIDGE_STAGE_2_TOPICS } from './cambridge/stage-2';

export interface StageMetadata {
  id: string;
  name: string;
  curriculum: CurriculumTrack;
  topics: Topic[];
}

export const CURRICULUM_DATA: Record<CurriculumTrack, { stages: StageMetadata[] }> = {
  cambridge: {
    stages: [
      {
        id: 'Early Years',
        name: 'Cambridge Early Years (K-Level)',
        curriculum: 'cambridge',
        topics: [
          {
            id: 'ey-basic-numbers',
            title: 'Topik 1: Bilangan & Pola Awal',
            challenges: CAMBRIDGE_EARLY_YEARS, // 10 level awal
          },
        ],
      },
      {
        id: 'Stage 1',
        name: 'Primary Stage 1',
        curriculum: 'cambridge',
        topics: CAMBRIDGE_STAGE_1_TOPICS, // 3 topik Stage 1 di atas
      },
      // {
      //   id: 'Stage 2',
      //   name: 'Primary Stage 2',
      //   curriculum: 'cambridge',
      //   topics: CAMBRIDGE_STAGE_2_TOPICS,
      // }
    ],
  },
  ib: {
    stages: [
      {
        id: 'Early Years',
        name: 'IB Early Years',
        curriculum: 'ib',
        topics: [
          {
            id: 'ib-ey-inquiry',
            title: 'Topik 1: Eksplorasi Konsep Bilangan',
            challenges: CAMBRIDGE_EARLY_YEARS.slice(0, 5),
          },
        ],
      },
    ],
  },
};

// Helper: Ambil semua topik berdasarkan kurikulum dan grade
export const getTopicsByStage = (curriculum: CurriculumTrack, stageId: string): Topic[] => {
  const stage = CURRICULUM_DATA[curriculum]?.stages.find(
    (s) => s.id.toLowerCase() === stageId.toLowerCase()
  );
  return stage ? stage.topics : [];
};
