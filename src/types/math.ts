// src/types/math.ts

/**
 * Nilai numerik resmi kepingan Numicon (1 hingga 10)
 */
export type NumiconValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Derajat rotasi kepingan pada papan bermain
 */
export type RotationAngle = 0 | 90 | 180 | 270;

/**
 * Representasi kepingan yang telah ditempatkan di atas kanvas
 */
export interface PlacedPiece {
  id: string;
  value: NumiconValue;
  x: number;
  y: number;
  rotation: RotationAngle;
  zIndex?: number;
  isLocked?: boolean;
}

/**
 * Metadata visual & geometris kepingan Numicon
 */
export interface NumiconMetadata {
  value: NumiconValue;
  colorHex: string;
  isOdd: boolean;
  pairCount: number;      // Jumlah baris pasangan lengkap (2 kolom)
  hasExtraPeg: boolean;   // true jika bernilai ganjil (satu lubang ekstra di atas)
  gridWidth: number;      // Lebar dalam satuan grid unit (standar: 2 unit)
  gridHeight: number;     // Tinggi dalam satuan grid unit
}

/**
 * Jenis alat peraga matematika digital yang didukung platform
 */
export type ManipulativeType =
  | 'numicon'
  | 'base-ten'
  | 'cuisenaire'
  | 'fraction-tiles'
  | 'geoboard'
  | 'algebra-tiles';

/**
 * Jalur kurikulum internasional
 */
export type CurriculumTrack = 'cambridge' | 'ib';

/**
 * Tahapan belajar berbasis pendekatan Concrete - Pictorial - Abstract (CPA)
 */
export type LearningPhase = 'concrete' | 'pictorial' | 'abstract';

/**
 * Pilihan bahasa dan parameter Text-to-Speech (TTS)
 */
export interface TTSInstruction {
  text: string;           // Teks yang ditampilkan di antarmuka
  speechText?: string;     // Teks fonetik yang dibacakan oleh mesin suara
  lang?: 'id-ID' | 'en-GB' | 'en-US';
  rate?: number;          // Kecepatan membaca (standar anak-anak: 0.8 - 0.9)
  pitch?: number;         // Nada suara (standar ramah anak: 1.0 - 1.1)
}

/**
 * Kategori logika evaluasi pada tantangan asesmen
 */
export type ChallengeEvaluationType =
  | 'exact-sum'           // Total lubang harus bernilai persis N
  | 'parity-check'        // Seluruh keping harus berjenis ganjil atau genap
  | 'exact-pieces'        // Harus menggunakan kombinasi kepingan tertentu
  | 'ten-frame-fill'      // Mengisi slot bingkai 10 secara tepat
  | 'number-bond';        // Pasangan keping yang membentuk nilai tertentu

/**
 * Kriteria validasi jawaban pada kanvas
 */
export interface ChallengeValidationRules {
  type: ChallengeEvaluationType;
  targetTotal?: number;
  requiredParity?: 'even' | 'odd';
  exactPieces?: NumiconValue[];
  minPiecesAllowed?: number;
  maxPiecesAllowed?: number;
  allowRotation?: boolean;
}

/**
 * Struktur modul latihan atau soal asesmen bertahap (Level / Misi)
 */
export interface Challenge {
  id: string;
  moduleCode: string;     // Contoh: "CAM-EY-NUM-01" atau "IB-PYP1-NB-10"
  curriculum: CurriculumTrack;
  stage: string;          // Contoh: "Early Years", "Stage 1", "PYP 1"
  topicId?: string;       // Pengenal topik induk (opsional)
  phase: LearningPhase;
  title: string;
  instruction: TTSInstruction;
  hint?: TTSInstruction;
  validation: ChallengeValidationRules;
  initialBoardPieces?: PlacedPiece[]; // Keping awal yang sudah terpasang
  availableTrayPieces?: NumiconValue[]; // Batasan keping yang bisa ditarik siswa
}

/**
 * Pengelompokan tantangan/misi ke dalam satu topik pembelajaran
 */
export interface Topic {
  id: string;             // Contoh: "s1-topic-bonds-10"
  title: string;          // Contoh: "Topik 2: Ikatan Bilangan Menuju 10"
  description?: string;   // Ringkasan tujuan pembelajaran topik
  challenges: Challenge[];// Daftar level / misi di dalam topik ini
}

/**
 * Metadata jenjang / tingkatan kelas (Grade / Stage)
 */
export interface StageMetadata {
  id: string;             // Contoh: "Stage 1", "Early Years"
  name: string;           // Contoh: "Primary Stage 1"
  curriculum: CurriculumTrack;
  description?: string;
  topics: Topic[];
}

/**
 * Metadata lengkap satu jalur kurikulum
 */
export interface CurriculumMetadata {
  id: CurriculumTrack;
  name: string;
  badge: string;
  description: string;
  stages: StageMetadata[];
}

/**
 * Hasil kalkulasi evaluasi jawaban kanvas
 */
export interface EvaluationResult {
  isCorrect: boolean;
  currentTotal: number;
  currentPieceCount: number;
  stars: 0 | 1 | 2 | 3;
  feedbackText: string;
  feedbackSpeech: string;
}

/**
 * Tipe suara sintetis dan audio feedback
 */
export type SoundEffectType = 'snap' | 'correct' | 'wrong' | 'tap' | 'celebrate';

/**
 * Status progres belajar siswa yang disimpan secara lokal (PWA Offline / IndexedDB)
 */
export interface StudentTopicProgress {
  challengeId: string;
  curriculum: CurriculumTrack;
  stage: string;
  topicId?: string;
  completed: boolean;
  starsEarned: 0 | 1 | 2 | 3;
  score: number;          // Skala 0 - 100
  attemptsCount: number;
  timeSpentSeconds: number;
  lastAttemptTimestamp: number;
}

/**
 * Ringkasan statistik capaian belajar pada suatu jenjang atau topik
 */
export interface StageProgressSummary {
  totalChallenges: number;
  completedCount: number;
  starsEarned: number;
  maxPossibleStars: number;
  completionPercentage: number;
}
