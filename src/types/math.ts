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
 * Ragam alat peraga manipulatif matematika digital
 */
export type ManipulativeType =
  | 'numicon'
  | 'ten-frame'
  | 'base-ten'
  | 'number-line'
  | 'balance-scale'
  | 'rekenrek'
  | 'fraction-tiles'
  | 'geoboard'
  | 'bar-model'
  | 'algebra-tiles'
  | 'equation-builder'
  | 'card-matching';

/**
 * Tipe komponen kanvas interaktif yang aktif pada level terkait
 */
export type InteractiveType =
  | 'numicon'            // Papan interaktif kepingan Numicon
  | 'ten-frame'          // Bingkai sepuluh dengan koin dua warna
  | 'number-line'        // Garis bilangan interaktif & lompatan katak
  | 'balance-scale'      // Timbangan kesetaraan aljabar awal (2 lengan)
  | 'rekenrek'           // Manik kawat geser 20 / 100
  | 'bar-model'          // Diagram pita part-whole model
  | 'equation-builder'   // Kartu angka & penyusun simbol operasi matematika
  | 'card-matching';     // Menjodohkan representasi visual piktorial

/**
 * Model mode pedagogis pada tahapan belajar
 */
export type ActivityMode =
  | 'exploration'        // Eksplorasi bebas tanpa penalti salah (Sandbox)
  | 'guided-practice'    // Latihan terarah bertahap dengan bantuan visual & petunjuk
  | 'assessment';        // Uji pemahaman mandiri untuk mengukur mastery

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
  text: string;           // Teks visual yang tampil di antarmuka
  speechText?: string;    // Teks fonetik yang dibacakan oleh mesin suara
  lang?: 'id-ID' | 'en-GB' | 'en-US';
  rate?: number;          // Kecepatan membaca (standar anak-anak: 0.8 - 0.9)
  pitch?: number;         // Nada suara (standar ramah anak: 1.0 - 1.1)
}

/**
 * Kategori logika evaluasi pada tantangan asesmen
 */
export type ChallengeEvaluationType =
  | 'exact-sum'           // Total nilai harus tepat N
  | 'parity-check'        // Seluruh keping/objek harus ganjil atau genap
  | 'exact-pieces'        // Harus menggunakan kombinasi objek tertentu
  | 'ten-frame-fill'      // Mengisi slot bingkai 10 secara tepat
  | 'number-bond'         // Pasangan nilai yang membentuk target tertentu
  | 'balance-equilibrium' // Kedua lengan timbangan harus setimbang
  | 'slot-fill'           // Mengisi seluruh slot target secara lengkap
  | 'correct-equation'    // Susunan persamaan matematika benar
  | 'matching-complete';  // Seluruh pasangan kartu telah dicocokkan

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
  targetEquation?: string;
  expectedPairsCount?: number;
}

/**
 * Muatan data interaksi siswa yang dikirimkan oleh komponen kanvas apa pun ke evaluator
 */
export interface InteractionPayload {
  totalValue?: number;             // Total akumulasi nilai pada kanvas
  placedCount?: number;            // Jumlah objek/keping yang terpasang
  counterDistribution?: {          // Distribusi warna (misal pada Ten-Frame / Rekenrek)
    colorA: number;
    colorB: number;
  };
  balanceStatus?: 'left-heavy' | 'right-heavy' | 'balanced'; // Status timbangan
  numberLinePosition?: number;     // Posisi titik pada garis bilangan
  equationString?: string;         // String kalimat matematika yang tersusun
  matchedPairs?: [string, string][]; // Pasangan kartu yang berhasil dijodohkan
  isComplete?: boolean;            // Penanda apakah kanvas sudah terisi penuh
}

/**
 * Struktur modul latihan atau soal asesmen bertahap (Level / Misi)
 */
export interface Challenge {
  id: string;
  moduleCode: string;               // Contoh: "CAM-EY-NUM-01" atau "IB-EY-U1-01"
  curriculum: CurriculumTrack;
  stage: string;                    // Contoh: "Early Years", "Stage 1", "PYP 1"
  topicId?: string;                 // Pengenal topik induk
  phase: LearningPhase;             // 'concrete' | 'pictorial' | 'abstract'
  activityMode?: ActivityMode;       // 'exploration' | 'guided-practice' | 'assessment'
  interactiveType?: InteractiveType; // Komponen kanvas yang digunakan (default: 'numicon')
  title: string;
  instruction: TTSInstruction;
  hint?: TTSInstruction;
  validation: ChallengeValidationRules;
  initialBoardPieces?: PlacedPiece[]; // Keping awal yang sudah terpasang
  availableTrayPieces?: NumiconValue[]; // Batasan keping yang bisa ditarik siswa
  config?: Record<string, any>;     // Parameter konfigurasi dinamis alat interaktif
}

/**
 * Pengelompokan tantangan/misi ke dalam satu topik pembelajaran
 */
export interface Topic {
  id: string;              // Contoh: "ib-ey-topic-placevalue"
  title: string;           // Contoh: "Topik 1: Number & Place Value (1–10)"
  description?: string;    // Ringkasan tujuan pembelajaran topik
  challenges: Challenge[]; // Daftar level / misi di dalam topik ini
}

/**
 * Metadata jenjang / tingkatan kelas (Grade / Stage)
 */
export interface StageMetadata {
  id: string;              // Contoh: "Stage 1", "Early Years"
  name: string;            // Contoh: "Primary Stage 1"
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
 * Tipe efek suara sintetis dan umpan balik audio
 */
export type SoundEffectType = 'snap' | 'correct' | 'wrong' | 'tap' | 'celebrate';

/**
 * Status progres belajar siswa yang disimpan secara lokal (PWA Offline / IndexedDB / LocalStorage)
 */
export interface StudentTopicProgress {
  challengeId: string;
  curriculum: CurriculumTrack;
  stage: string;
  topicId?: string;
  completed: boolean;
  starsEarned: 0 | 1 | 2 | 3;
  score: number;           // Skala 0 - 100
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
