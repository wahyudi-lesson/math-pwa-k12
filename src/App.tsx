// src/App.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameBoard } from './components/GameBoard';
import {
  PlacedPiece,
  EvaluationResult,
  StudentTopicProgress,
  CurriculumTrack,
  Challenge,
} from './types/math';
import {
  speakInstruction,
  stopSpeech,
  playSoundEffect,
} from './lib/audio';
import { CURRICULA_METADATA, getChallengesByStage } from './content';
import { saveProgress } from './lib/storage';
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
  BookOpen,
} from 'lucide-react';

// Fallback tantangan dasar jika bank konten belum termuat
const FALLBACK_CHALLENGES: Challenge[] = [
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
];

export default function App() {
  // 1. State Pemilihan Kurikulum & Jenjang
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumTrack>('cambridge');
  const [selectedStage, setSelectedStage] = useState<string>('Early Years');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);

  // 2. Ambil daftar tantangan secara dinamis dari src/content/
  const stageChallenges = useMemo(() => {
    const loaded = getChallengesByStage(selectedCurriculum, selectedStage);
    return loaded.length > 0 ? loaded : FALLBACK_CHALLENGES;
  }, [selectedCurriculum, selectedStage]);

  const activeChallenge = stageChallenges[currentChallengeIndex] || stageChallenges[0];

  // 3. State Papan Kanvas & Evaluasi
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const [currentPieces, setCurrentPieces] = useState<PlacedPiece[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [boardKey, setBoardKey] = useState<number>(0);

  // 4. PWA Installation State
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // 5. Riwayat Bintang & Progres Siswa
  const [progressMap, setProgressMap] = useState<Record<string, StudentTopicProgress>>(() => {
    try {
      const saved = localStorage.getItem('mathverse_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentProgress = activeChallenge ? progressMap[activeChallenge.id] : undefined;

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

  // Baca otomatis instruksi suara setiap kali level atau kurikulum berganti
  useEffect(() => {
    stopSpeech();
    setIsSpeakingText(false);
    setAttempts(0);
    setEvaluation(null);
    setShowHint(false);
    setCurrentTotal(0);
    setCurrentPieces([]);
    setBoardKey((prev) => prev + 1);

    if (activeChallenge) {
      const timer = setTimeout(() => {
        handlePlaySpeech(activeChallenge.instruction);
      }, 400);

      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [selectedCurriculum, selectedStage, currentChallengeIndex]);

  // Fungsi pengontrol suara Text-to-Speech
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

  // Pembaruan data papan kanvas
  const handleBoardUpdate = useCallback((total: number, pieces: PlacedPiece[]) => {
    setCurrentTotal(total);
    setCurrentPieces(pieces);
    setEvaluation((prev) => (prev ? null : prev));
  }, []);

  // Mesin Evaluasi Aturan Pembelajaran
  const handleCheckAnswer = async () => {
    if (!activeChallenge) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const rules = activeChallenge.validation;
    const pieceCount = currentPieces.length;

    // 1. Kondisi papan kosong
    if (pieceCount === 0) {
      playSoundEffect('wrong');
      const res: EvaluationResult = {
        isCorrect: false,
        currentTotal: 0,
        currentPieceCount: 0,
        stars: 0,
        feedbackText: 'Papan masih kosong! Tarik kepingan dari kotak bawah.',
        feedbackSpeech: 'Papan masih kosong! Tarik kepingan dari kotak bawah terlebih dahulu.',
      };
      setEvaluation(res);
      speakInstruction(res.feedbackSpeech);
      return;
    }

    // 2. Evaluasi Nilai Tepat (exact-sum)
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
            feedbackText: `Jumlah sudah ${target}, tetapi gunakan minimal ${rules.minPiecesAllowed} keping ya!`,
            feedbackSpeech: `Jumlah sudah ${target}, tetapi gunakan minimal ${rules.minPiecesAllowed} keping ya!`,
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
            feedbackText: `Jumlah pas ${target}, tetapi gunakan tepat ${rules.maxPiecesAllowed} keping!`,
            feedbackSpeech: `Jumlah pas ${target}, tetapi gunakan tepat ${rules.maxPiecesAllowed} keping!`,
          };
          setEvaluation(res);
          speakInstruction(res.feedbackSpeech);
          return;
        }

        await handleSuccess(nextAttempts);
        return;
      }

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

    // 3. Evaluasi Paritas Bilangan (Ganjil vs Genap)
    if (rules.type === 'parity-check') {
      const target = rules.targetTotal || 0;
      const isTargetEven = rules.requiredParity === 'even';
      const hasInvalidPiece = isTargetEven
        ? currentPieces.some((p) => p.value % 2 !== 0)
        : currentPieces.some((p) => p.value % 2 === 0);

      if (hasInvalidPiece) {
        playSoundEffect('wrong');
        const text = isTargetEven
          ? 'Ada keping ganjil dengan tonjolan! Gunakan hanya keping genap yang tepinya rata.'
          : 'Ada keping genap yang rata! Gunakan hanya keping ganjil yang memiliki tonjolan.';
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

      if (currentTotal !== target) {
        playSoundEffect('wrong');
        const parityWord = isTargetEven ? 'genap' : 'ganjil';
        const res: EvaluationResult = {
          isCorrect: false,
          currentTotal,
          currentPieceCount: pieceCount,
          stars: 0,
          feedbackText: `Kepingan sudah ${parityWord}, tetapi totalnya ${currentTotal}. Targetnya adalah ${target}.`,
          feedbackSpeech: `Kepingan sudah ${parityWord}, tetapi totalnya ${currentTotal}. Buatlah hingga pas ${target}.`,
        };
        setEvaluation(res);
        speakInstruction(res.feedbackSpeech);
        return;
      }

      await handleSuccess(nextAttempts);
    }
  };

  // Penanganan Keberhasilan Asesmen
  const handleSuccess = async (finalAttempts: number) => {
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

    // Simpan ke State dan LocalStorage
    const newProgressMap = {
      ...progressMap,
      [activeChallenge.id]: updatedRecord,
    };
    setProgressMap(newProgressMap);
    try {
      localStorage.setItem('mathverse_progress', JSON.stringify(newProgressMap));
      // Sinkronisasi ke IndexedDB di background
      await saveProgress(updatedRecord);
    } catch (e) {
      console.warn('Gagal menyimpan progres secara lokal', e);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < stageChallenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
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

  const totalStarsAccumulated = Object.values(progressMap).reduce(
    (sum, item) => sum + (item.starsEarned || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-12 font-sans selection:bg-amber-200">
      {/* 1. Bar Navigasi Atas & Info Progres */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
                MathVerse
                <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  K–12
                </span>
              </span>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Pendekatan CPA Multi-Sensori • Cambridge & IB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-2xl shadow-xs">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black text-amber-900">{totalStarsAccumulated}</span>
              <span className="text-xs text-amber-700 font-bold hidden sm:inline">Bintang</span>
            </div>

            {isInstallable && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pasang Aplikasi</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Konten Utama Pembelajaran */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 flex flex-col gap-4">
        {/* Panel Pemilihan Jalur Kurikulum & Jenjang */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Pilih Kurikulum:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Cambridge vs IB */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
              {(['cambridge', 'ib'] as CurriculumTrack[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => {
                    setSelectedCurriculum(cur);
                    setSelectedStage(CURRICULA_METADATA[cur].stages[0].id);
                    setCurrentChallengeIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                    selectedCurriculum === cur
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cur === 'cambridge' ? 'Cambridge' : 'IB'}
                </button>
              ))}
            </div>

            {/* Dropdown Jenjang (Stage / Grade) */}
            <select
              value={selectedStage}
              onChange={(e) => {
                setSelectedStage(e.target.value);
                setCurrentChallengeIndex(0);
              }}
              className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-2 rounded-2xl border-none outline-none cursor-pointer hover:bg-slate-200/80 transition"
            >
              {CURRICULA_METADATA[selectedCurriculum].stages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Pemilihan Level / Misi Belajar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {stageChallenges.map((ch, idx) => {
            const isCompleted = progressMap[ch.id]?.completed;
            const starCount = progressMap[ch.id]?.starsEarned || 0;
            const isActive = idx === currentChallengeIndex;

            return (
              <button
                key={ch.id}
                type="button"
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
        {activeChallenge && (
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

            {showHint && activeChallenge.hint && (
              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-start gap-2 text-sm text-amber-900 font-semibold animate-in fade-in duration-200">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{activeChallenge.hint.text}</span>
              </div>
            )}
          </section>
        )}

        {/* 3. Kanvas Papan Permainan Interaktif Numicon */}
        <section className="relative">
          <GameBoard
            key={boardKey}
            availableTrayPieces={activeChallenge?.availableTrayPieces}
            targetTenFrame={activeChallenge?.validation.targetTotal === 10}
            highlightOddPegs={activeChallenge?.validation.type === 'parity-check'}
            onTotalChange={handleBoardUpdate}
          />
        </section>

        {/* 4. Panel Bawah: Status Nilai, Validasi & Evaluasi Bintang */}
        <footer className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-baseline gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Total Lubang:
              </span>
              <span
                className={`text-2xl font-black ${
                  activeChallenge?.validation.targetTotal &&
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

          {/* Feedback Hasil Pemeriksaan */}
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

          {/* Tombol Kontrol */}
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
