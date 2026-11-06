// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import {
  Challenge,
  PlacedPiece,
  EvaluationResult,
  StudentTopicProgress,
} from './types/math';
import {
  speakInstruction,
  stopSpeech,
  playSoundEffect,
} from './lib/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  Download,
} from 'lucide-react';

// ============================================================================
// DAFTAR TANTANGAN KURIKULUM K-LEVEL (CAMBRIDGE EARLY YEARS & IB PYP)
// ============================================================================
const CHALLENGES: Challenge[] = [
  {
    id: 'cam-ey-01',
    moduleCode: 'CAM-EY-NUM-01',
    curriculum: 'cambridge',
    stage: 'Early Years',
    phase: 'concrete',
    title: 'Misi 1: Mengenal Angka 5',
    instruction: {
      text: 'Tarik kepingan ke papan sampai jumlah seluruh lubang tepat bernilai 5!',
      speechText: 'Tarik kepingan ke papan sampai jumlah seluruh lubang tepat bernilai lima!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Petunjuk: Kamu bisa menggunakan satu keping 5, atau gabungan keping 2 dan 3.',
      speechText: 'Petunjuk: Kamu bisa menggunakan satu keping lima, atau gabungan keping dua dan tiga.',
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
    moduleCode: 'CAM-EY-BONDS-10',
    curriculum: 'cambridge',
    stage: 'Stage 1',
    phase: 'concrete',
    title: 'Misi 2: Pasangan Bilangan 10',
    instruction: {
      text: 'Gunakan tepat 2 keping Numicon untuk membuat angka 10!',
      speechText: 'Gunakan tepat dua keping Numicon untuk membuat angka sepuluh!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Petunjuk: Pasangkan keping 7 dengan keping 3, atau keping 6 dengan keping 4.',
      speechText: 'Petunjuk: Pasangkan keping tujuh dengan keping tiga, atau keping enam dengan keping empat.',
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
    id: 'ib-pyp-03',
    moduleCode: 'IB-PYP1-PARITY',
    curriculum: 'ib',
    stage: 'PYP 1',
    phase: 'pictorial',
    title: 'Misi 3: Pasukan Bilangan Genap',
    instruction: {
      text: 'Gunakan hanya keping bilangan GENAP (tepi rata tanpa tonjolan) hingga totalnya 8!',
      speechText: 'Gunakan hanya keping bilangan genap yang tepinya rata tanpa tonjolan hingga totalnya delapan!',
      lang: 'id-ID',
    },
    hint: {
      text: 'Petunjuk: Keping genap adalah keping biru muda (2), hijau muda (4), cyan (6), dan zamrud (8).',
      speechText: 'Petunjuk: Keping genap adalah keping biru muda dua, hijau muda empat, cyan enam, dan zamrud delapan.',
      lang: 'id-ID',
    },
    validation: {
      type: 'parity-check',
      targetTotal: 8,
      requiredParity: 'even',
    },
    availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8],
  },
];

export default function App() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const [currentPieces, setCurrentPieces] = useState<PlacedPiece[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [boardKey, setBoardKey] = useState<number>(0); // Pengontrol re-mount kanvas saat ganti level
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Riwayat bintang dan progres yang tersimpan di LocalStorage
  const [progressMap, setProgressMap] = useState<Record<string, StudentTopicProgress>>(() => {
    try {
      const saved = localStorage.getItem('mathverse_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const activeChallenge = CHALLENGES[currentChallengeIndex];
  const currentProgress = progressMap[activeChallenge.id];

  // Tangkap event instalasi browser untuk PWA
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Baca otomatis instruksi saat tantangan pertama kali dimuat atau berganti
  useEffect(() => {
    stopSpeech();
    setAttempts(0);
    setEvaluation(null);
    setShowHint(false);
    setCurrentTotal(0);
    setCurrentPieces([]);
    setBoardKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      handlePlaySpeech(activeChallenge.instruction);
    }, 400);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [currentChallengeIndex]);

  // Fungsi pembaca suara Text-to-Speech
  const handlePlaySpeech = (instruction: Challenge['instruction']) => {
    if (isSpeakingText) {
      stopSpeech();
      setIsSpeakingText(false);
      return;
    }

    setIsSpeakingText(true);
    speakInstruction(instruction, {
      onEnd: () => setIsSpeakingText(false),
      onError: () => setIsSpeakingText(false),
    });
  };

  // Callback pembaruan status papan kanvas
  const handleBoardUpdate = useCallback((total: number, pieces: PlacedPiece[]) => {
    setCurrentTotal(total);
    setCurrentPieces(pieces);
    // Hapus hasil evaluasi sementara saat siswa sedang memanipulasi keping kembali
    setEvaluation((prev) => (prev ? null : prev));
  }, []);

  // Mesin evaluasi aturan matematika
  const handleCheckAnswer = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const rules = activeChallenge.validation;
    const pieceCount = currentPieces.length;

    // 1. Kasus papan kosong
    if (pieceCount === 0) {
      playSoundEffect('wrong');
      const res: EvaluationResult = {
        isCorrect: false,
        currentTotal: 0,
        currentPieceCount: 0,
        stars: 0,
        feedbackText: 'Papan masih kosong! Tarik kepingan dari kotak bawah.',
        feedbackSpeech: 'Papan masih kosong! Ambil kepingan dari kotak bawah terlebih dahulu.',
      };
      setEvaluation(res);
      speakInstruction(res.feedbackSpeech);
      return;
    }

    // 2. Evaluasi tipe 'exact-sum'
    if (rules.type === 'exact-sum') {
      const target = rules.targetTotal || 0;

      if (currentTotal === target) {
        if (rules.minPiecesAllowed && pieceCount < rules.minPiecesAllowed) {
          playSoundEffect('wrong');
          const res: EvaluationResult = {
            isCorrect: false,
            currentTotal,
            currentPieceCount: pieceCount,
            stars: 0,
            feedbackText: `Jumlahnya sudah 10, tetapi gunakan tepat ${rules.minPiecesAllowed} keping ya!`,
            feedbackSpeech: `Jumlahnya sudah sepuluh, tetapi gunakan tepat dua keping ya!`,
          };
          setEvaluation(res);
          speakInstruction(res.feedbackSpeech);
          return;
        }

        if (rules.maxPiecesAllowed && pieceCount > rules.maxPiecesAllowed) {
          playSoundEffect('wrong');
          const res: EvaluationResult = {
            isCorrect: false,
            currentTotal,
            currentPieceCount: pieceCount,
            stars: 0,
            feedbackText: `Jumlahnya pas 10, tapi kamu harus menggunakan tepat ${rules.maxPiecesAllowed} keping!`,
            feedbackSpeech: `Jumlahnya pas sepuluh, tapi gunakan tepat dua keping!`,
          };
          setEvaluation(res);
          speakInstruction(res.feedbackSpeech);
          return;
        }

        // Jawaban Benar
        handleSuccess(nextAttempts);
        return;
      }

      // Jawaban Salah (Kekurangan atau Kelebihan)
      playSoundEffect('wrong');
      const diff = Math.abs(target - currentTotal);
      const text =
        currentTotal < target
          ? `Total saat ini ${currentTotal}. Masih kurang ${diff} lubang lagi!`
          : `Total saat ini ${currentTotal}. Kelebihan ${diff} lubang, coba kurangi kepingan.`;

      const res: EvaluationResult = {
        isCorrect: false,
        currentTotal,
        currentPieceCount: pieceCount,
        stars: 0,
        feedbackText: text,
        feedbackSpeech: text,
      };
      setEvaluation(res);
      speakInstruction(res.feedbackSpeech);
      return;
    }

    // 3. Evaluasi tipe 'parity-check' (Ganjil / Genap)
    if (rules.type === 'parity-check') {
      const target = rules.targetTotal || 0;
      const hasOdd = currentPieces.some((p) => p.value % 2 !== 0);

      if (rules.requiredParity === 'even' && hasOdd) {
        playSoundEffect('wrong');
        const res: EvaluationResult = {
          isCorrect: false,
          currentTotal,
          currentPieceCount: pieceCount,
          stars: 0,
          feedbackText: 'Ada keping ganjil dengan ujung menonjol! Gunakan hanya keping genap yang rata.',
          feedbackSpeech: 'Ada keping ganjil di papan! Gunakan hanya keping genap yang tepinya rata.',
        };
        setEvaluation(res);
        speakInstruction(res.feedbackSpeech);
        return;
      }

      if (currentTotal !== target) {
        playSoundEffect('wrong');
        const res: EvaluationResult = {
          isCorrect: false,
          currentTotal,
          currentPieceCount: pieceCount,
          stars: 0,
          feedbackText: `Semua keping sudah genap, tapi totalnya ${currentTotal}. Targetnya adalah ${target}.`,
          feedbackSpeech: `Semua keping sudah genap, tapi totalnya ${currentTotal}. Buatlah hingga pas delapan.`,
        };
        setEvaluation(res);
        speakInstruction(res.feedbackSpeech);
        return;
      }

      // Jawaban Benar Parity
      handleSuccess(nextAttempts);
    }
  };

  // Penanganan keberhasilan asesmen
  const handleSuccess = (finalAttempts: number) => {
    // 1 Percobaan = 3 Bintang, 2 Percobaan = 2 Bintang, >=3 Percobaan = 1 Bintang
    const starsEarned = (finalAttempts <= 1 ? 3 : finalAttempts === 2 ? 2 : 1) as 1 | 2 | 3;

    if (starsEarned === 3) {
      playSoundEffect('celebrate');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'],
      });
    } else {
      playSoundEffect('correct');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }

    const res: EvaluationResult = {
      isCorrect: true,
      currentTotal,
      currentPieceCount: currentPieces.length,
      stars: starsEarned,
      feedbackText: `Luar biasa! Target tercapai sempurna dengan ${starsEarned} bintang!`,
      feedbackSpeech: `Luar biasa! Target tercapai sempurna. Kamu mendapatkan ${starsEarned} bintang!`,
    };

    setEvaluation(res);
    speakInstruction(res.feedbackSpeech);

    // Simpan progres ke local storage
    const updatedRecord: StudentTopicProgress = {
      challengeId: activeChallenge.id,
      curriculum: activeChallenge.curriculum,
      stage: activeChallenge.stage,
      completed: true,
      starsEarned: Math.max(starsEarned, currentProgress?.starsEarned || 0) as 1 | 2 | 3,
      score: starsEarned === 3 ? 100 : starsEarned === 2 ? 80 : 60,
      attemptsCount: finalAttempts,
      timeSpentSeconds: 0,
      lastAttemptTimestamp: Date.now(),
    };

    const newProgressMap = {
      ...progressMap,
      [activeChallenge.id]: updatedRecord,
    };
    setProgressMap(newProgressMap);
    try {
      localStorage.setItem('mathverse_progress', JSON.stringify(newProgressMap));
    } catch (e) {
      console.warn('Gagal menyimpan progres ke localStorage', e);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < CHALLENGES.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      // Kembali ke tantangan pertama jika telah menyelesaikan semua misi
      setCurrentChallengeIndex(0);
    }
  };

  const handleResetChallenge = () => {
    playSoundEffect('tap');
    setBoardKey((prev) => prev + 1);
    setEvaluation(null);
    setCurrentTotal(0);
    setCurrentPieces([]);
  };

  // Menghitung akumulasi bintang yang diperoleh siswa di seluruh level
  const totalStarsAccumulated = Object.values(progressMap).reduce(
    (sum, item) => sum + (item.starsEarned || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-12 font-sans selection:bg-amber-200">
      {/* 1. Bar Navigasi Atas & Info Progres */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
                MathVerse
                <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  K-Level
                </span>
              </span>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Pendekatan CPA Multi-Sensori • Cambridge & IB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Indikator Total Koleksi Bintang */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-2xl shadow-xs">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black text-amber-900">{totalStarsAccumulated}</span>
              <span className="text-xs text-amber-700 font-bold hidden sm:inline">Bintang</span>
            </div>

            {/* Tombol Install PWA (Jika Didukung Browser) */}
            {isInstallable && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang Aplikasi</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Konten Utama Pembelajaran */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-5">
        {/* Tab Pemilihan Level / Misi Belajar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CHALLENGES.map((ch, idx) => {
            const isCompleted = progressMap[ch.id]?.completed;
            const starCount = progressMap[ch.id]?.starsEarned || 0;
            const isActive = idx === currentChallengeIndex;

            return (
              <button
                key={ch.id}
                onClick={() => setCurrentChallengeIndex(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Level {idx + 1}</span>
                {isCompleted ? (
                  <span className="flex items-center text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] ml-0.5 text-inherit font-black">
                      {starCount}
                    </span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Kotak Instruksi & Audio TTS */}
        <section className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-md">
                  {activeChallenge.curriculum.toUpperCase()} • {activeChallenge.stage}
                </span>
                <span className="text-xs font-semibold text-amber-700">
                  Kode: {activeChallenge.moduleCode}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {activeChallenge.title}
              </h1>

              {/* Teks Instruksi: Interaktif untuk Suara */}
              <p
                onClick={() => handlePlaySpeech(activeChallenge.instruction)}
                className={`text-base sm:text-lg font-bold text-slate-700 mt-2 cursor-pointer transition-colors inline-block rounded-lg px-2 py-1 -ml-2 ${
                  isSpeakingText ? 'bg-amber-200/80 text-amber-950' : 'hover:bg-amber-100'
                }`}
                title="Klik untuk mendengarkan teks"
              >
                {activeChallenge.instruction.text}
              </p>
            </div>

            {/* Tombol Kontrol Suara TTS */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handlePlaySpeech(activeChallenge.instruction)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 ${
                  isSpeakingText
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
                aria-label="Dengarkan teks instruksi"
              >
                {isSpeakingText ? (
                  <>
                    <VolumeX className="w-5 h-5" />
                    <span>Hening</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Dengar</span>
                  </>
                )}
              </button>

              {activeChallenge.hint && (
                <button
                  type="button"
                  onClick={() => {
                    setShowHint(!showHint);
                    if (!showHint) {
                      playSoundEffect('tap');
                      handlePlaySpeech(activeChallenge.hint!);
                    }
                  }}
                  className={`p-3 rounded-2xl border font-bold text-sm transition-all ${
                    showHint
                      ? 'bg-amber-200 text-amber-900 border-amber-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Tampilkan petunjuk bantuan"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Kotak Petunjuk Bantuan (Hint) */}
          {showHint && activeChallenge.hint && (
            <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-start gap-2 text-sm text-amber-900 font-semibold animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{activeChallenge.hint.text}</span>
            </div>
          )}
        </section>

        {/* 3. Kanvas Papan Permainan Interaktif Numicon */}
        <section className="relative">
          <GameBoard
            key={boardKey}
            availableTrayPieces={activeChallenge.availableTrayPieces}
            targetTenFrame={activeChallenge.validation.targetTotal === 10}
            highlightOddPegs={activeChallenge.validation.type === 'parity-check'}
            onTotalChange={handleBoardUpdate}
          />
        </section>

        {/* 4. Panel Bawah: Status Nilai, Validasi & Evaluasi Bintang */}
        <footer className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Monitor Nilai Aktif */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-baseline gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Total Lubang:
              </span>
              <span
                className={`text-2xl font-black ${
                  activeChallenge.validation.targetTotal &&
                  currentTotal === activeChallenge.validation.targetTotal
                    ? 'text-emerald-600'
                    : 'text-blue-600'
                }`}
              >
                {currentTotal}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-semibold">
              Keping terpakai: <span className="text-slate-700 font-bold">{currentPieces.length}</span>
            </div>
          </div>

          {/* Umpan Balik Teks & Bintang Hasil Evaluasi */}
          {evaluation && (
            <div
              className={`flex-1 px-4 py-2.5 rounded-2xl flex items-center gap-3 border text-sm font-bold animate-in fade-in zoom-in-95 duration-150 ${
                evaluation.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span className="flex-1">{evaluation.feedbackText}</span>

              {/* Tampilan Bintang */}
              {evaluation.isCorrect && (
                <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
                  {[1, 2, 3].map((starNum) => (
                    <Star
                      key={starNum}
                      className={`w-6 h-6 transition-all duration-300 ${
                        starNum <= evaluation.stars
                          ? 'fill-current scale-110 drop-shadow-sm'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tombol Aksi Verifikasi / Navigasi Misi */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={handleResetChallenge}
              className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition"
              title="Mulai Ulang Misi Ini"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {evaluation?.isCorrect ? (
              <button
                type="button"
                onClick={handleNextChallenge}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base px-7 py-3 rounded-2xl shadow-md shadow-emerald-600/20 transition"
              >
                <span>Misi Selanjutnya</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-base px-8 py-3 rounded-2xl shadow-md shadow-blue-600/20 transition"
              >
                Periksa Jawaban
              </button>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
