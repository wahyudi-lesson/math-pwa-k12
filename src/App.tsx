// src/App.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import {
  Challenge,
  EvaluationResult,
  StudentTopicProgress,
  CurriculumTrack,
  InteractionPayload,
} from './types/math';
import {
  speakInstruction,
  stopSpeech,
  playSoundEffect,
} from './lib/audio';
import { saveProgress } from './lib/storage';
import { evaluateInteraction } from './lib/evaluator';
import { CURRICULA_METADATA, getTopicsByStage } from './content';
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
  Layers,
} from 'lucide-react';

export default function App() {
  // 1. Navigasi Hirarkis (Kurikulum -> Stage -> Topik -> Level)
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumTrack>('ib');
  const [selectedStage, setSelectedStage] = useState<string>('Early Years');
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);

  // 2. Data Dinamis dari Content Repository
  const availableStages = useMemo(() => {
    return CURRICULA_METADATA[selectedCurriculum]?.stages || [];
  }, [selectedCurriculum]);

  const availableTopics = useMemo(() => {
    return getTopicsByStage(selectedCurriculum, selectedStage);
  }, [selectedCurriculum, selectedStage]);

  const activeTopic = availableTopics[selectedTopicIndex] || availableTopics[0];
  const activeChallenges = activeTopic ? activeTopic.challenges : [];
  const activeChallenge: Challenge | undefined =
    activeChallenges[currentChallengeIndex] || activeChallenges[0];

  // 3. State Interaksi Universal & Evaluasi
  const [currentPayload, setCurrentPayload] = useState<InteractionPayload>({
    totalValue: 0,
    placedCount: 0,
  });
  const [attempts, setAttempts] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [boardKey, setBoardKey] = useState<number>(0);

  // 4. PWA Install Prompt
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // 5. Progres Belajar Siswa (LocalStorage)
  const [progressMap, setProgressMap] = useState<Record<string, StudentTopicProgress>>(() => {
    try {
      const saved = localStorage.getItem('mathverse_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentProgress = activeChallenge ? progressMap[activeChallenge.id] : undefined;

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
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  // Reset kanvas dan otomatis putar instruksi audio saat level/topik berganti
  useEffect(() => {
    stopSpeech();
    setIsSpeakingText(false);
    setAttempts(0);
    setEvaluation(null);
    setShowHint(false);
    setCurrentPayload({ totalValue: 0, placedCount: 0 });
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
  }, [selectedCurriculum, selectedStage, selectedTopicIndex, currentChallengeIndex]);

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

  // Menangkap payload dari InteractiveCanvas (Numicon, TenFrame, dsb.)
  const handleInteractionChange = useCallback((payload: InteractionPayload) => {
    setCurrentPayload(payload);
    setEvaluation((prev) => (prev ? null : prev));
  }, []);

  // Evaluasi Jawaban Memanfaatkan evaluator.ts
  const handleCheckAnswer = async () => {
    if (!activeChallenge) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    // Evaluasi terpusat
    const result = evaluateInteraction(activeChallenge, currentPayload, nextAttempts);
    setEvaluation(result);
    speakInstruction(result.feedbackSpeech);

    if (result.isCorrect) {
      // Efek visual & audio keberhasilan
      if (result.stars === 3) {
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

      // Simpan riwayat keberhasilan
      const updatedRecord: StudentTopicProgress = {
        challengeId: activeChallenge.id,
        curriculum: activeChallenge.curriculum,
        stage: activeChallenge.stage,
        topicId: activeChallenge.topicId,
        completed: true,
        starsEarned: Math.max(result.stars, currentProgress?.starsEarned || 0) as 1 | 2 | 3,
        score: result.stars === 3 ? 100 : result.stars === 2 ? 80 : 60,
        attemptsCount: nextAttempts,
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
        await saveProgress(updatedRecord);
      } catch (e) {
        console.warn('Gagal menyimpan progres secara lokal', e);
      }
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < activeChallenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else if (selectedTopicIndex < availableTopics.length - 1) {
      setSelectedTopicIndex((prev) => prev + 1);
      setCurrentChallengeIndex(0);
    } else {
      setSelectedTopicIndex(0);
      setCurrentChallengeIndex(0);
    }
  };

  const handleResetChallenge = () => {
    playSoundEffect('tap');
    setBoardKey((prev) => prev + 1);
    setEvaluation(null);
    setCurrentPayload({ totalValue: 0, placedCount: 0 });
  };

  const totalStarsAccumulated = useMemo(() => {
    return Object.values(progressMap).reduce((sum, item) => sum + (item.starsEarned || 0), 0);
  }, [progressMap]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-28 md:pb-12 font-sans selection:bg-amber-200">
      {/* 1. Bar Navigasi Atas */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-800 flex items-center gap-1.5">
                MathVerse
                <span className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  K–12
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Pendekatan CPA Multi-Sensori • Cambridge & IB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xs">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-black text-amber-900">{totalStarsAccumulated}</span>
              <span className="text-[10px] sm:text-xs text-amber-700 font-bold hidden xs:inline">Bintang</span>
            </div>

            {isInstallable && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition shadow-xs"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Pasang</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Konten Pembelajaran */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5 flex flex-col gap-3 sm:gap-4">
        {/* Panel Kurikulum & Jenjang */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500">
              Kurikulum:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl sm:rounded-2xl flex items-center gap-1">
              {(['cambridge', 'ib'] as CurriculumTrack[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => {
                    setSelectedCurriculum(cur);
                    const defaultStage = CURRICULA_METADATA[cur]?.stages[0]?.id || 'Early Years';
                    setSelectedStage(defaultStage);
                    setSelectedTopicIndex(0);
                    setCurrentChallengeIndex(0);
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all ${
                    selectedCurriculum === cur
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cur === 'cambridge' ? 'Cambridge' : 'IB'}
                </button>
              ))}
            </div>

            <select
              value={selectedStage}
              onChange={(e) => {
                setSelectedStage(e.target.value);
                setSelectedTopicIndex(0);
                setCurrentChallengeIndex(0);
              }}
              className="bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border-none outline-none cursor-pointer hover:bg-slate-200/80 transition"
            >
              {availableStages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Panel Pilihan Topik */}
        {availableTopics.length > 0 && (
          <div className="bg-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400 flex-shrink-0 mr-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Topik:</span>
            </div>
            {availableTopics.map((topic, tIdx) => {
              const isActiveTopic = selectedTopicIndex === tIdx;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicIndex(tIdx);
                    setCurrentChallengeIndex(0);
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActiveTopic
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {topic.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Panel Deretan Level */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin touch-pan-x">
          {activeChallenges.map((ch, idx) => {
            const isCompleted = progressMap[ch.id]?.completed;
            const starCount = progressMap[ch.id]?.starsEarned || 0;
            const isActive = idx === currentChallengeIndex;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setCurrentChallengeIndex(idx)}
                className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Level {idx + 1}</span>
                {isCompleted ? (
                  <span className="flex items-center text-amber-300">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                    <span className="text-[10px] ml-0.5 text-inherit font-black">
                      {starCount}
                    </span>
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Kotak Instruksi & TTS */}
        {activeChallenge && (
          <section className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                    {activeChallenge.curriculum.toUpperCase()} • {activeChallenge.stage}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    {activeChallenge.interactiveType || 'numicon'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-amber-700">
                    {activeChallenge.moduleCode}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-slate-800 mt-0.5">
                  {activeChallenge.title}
                </h1>

                <p
                  onClick={() => handlePlaySpeech(activeChallenge.instruction)}
                  className={`text-sm sm:text-lg font-bold text-slate-700 mt-1 sm:mt-2 cursor-pointer transition-colors inline-block rounded-lg px-2 py-1 -ml-2 ${
                    isSpeakingText ? 'bg-amber-200/80 text-amber-950' : 'hover:bg-amber-100'
                  }`}
                  title="Ketuk untuk mendengarkan teks instruksi"
                >
                  {activeChallenge.instruction.text}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handlePlaySpeech(activeChallenge.instruction)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                    isSpeakingText
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isSpeakingText ? (
                    <>
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Hening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
                    className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border font-bold transition-all ${
                      showHint
                        ? 'bg-amber-200 text-amber-900 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Petunjuk bantuan"
                  >
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {showHint && activeChallenge.hint && (
              <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex items-start gap-2 text-xs sm:text-sm text-amber-900 font-semibold animate-in fade-in duration-200">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{activeChallenge.hint.text}</span>
              </div>
            )}
          </section>
        )}

        {/* 3. Kanvas Interaktif Universal (Beralih sesuai interactiveType) */}
        {activeChallenge && (
          <section className="relative">
            <InteractiveCanvas
              challenge={activeChallenge}
              boardKey={boardKey}
              readOnly={evaluation?.isCorrect}
              onStateChange={handleInteractionChange}
            />
          </section>
        )}

        {/* 4. Panel Kontrol Bawah */}
        <footer className="fixed md:static bottom-0 left-0 right-0 z-30 bg-white/95 md:bg-white backdrop-blur-md md:backdrop-blur-none border-t md:border border-slate-200 p-3 sm:p-5 md:rounded-3xl shadow-lg md:shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="bg-slate-100 px-3.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 flex items-baseline gap-2">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500">
                Nilai / Objek:
              </span>
              <span
                className={`text-xl sm:text-2xl font-black ${
                  activeChallenge?.validation.targetTotal &&
                  currentPayload.totalValue === activeChallenge.validation.targetTotal
                    ? 'text-emerald-600'
                    : 'text-blue-600'
                }`}
              >
                {currentPayload.totalValue ?? currentPayload.placedCount ?? 0}
              </span>
            </div>

            <div className="text-[11px] sm:text-xs text-slate-400 font-semibold">
              Terpasang: <span className="text-slate-700 font-bold">{currentPayload.placedCount ?? 0}</span>
            </div>
          </div>

          {evaluation && (
            <div
              className={`w-full md:flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 border text-xs sm:text-sm font-bold animate-in fade-in zoom-in-95 duration-150 ${
                evaluation.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              )}
              <span className="flex-1">{evaluation.feedbackText}</span>

              {evaluation.isCorrect && (
                <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400 flex-shrink-0">
                  {[1, 2, 3].map((starNum) => (
                    <Star
                      key={starNum}
                      className={`w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300 ${
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

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={handleResetChallenge}
              className="p-2.5 sm:p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl sm:rounded-2xl transition"
              title="Mulai Ulang Misi"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {evaluation?.isCorrect ? (
              <button
                type="button"
                onClick={handleNextChallenge}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm sm:text-base px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl sm:rounded-2xl shadow-md shadow-emerald-600/20 transition"
              >
                <span>Misi Selanjutnya</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl shadow-md shadow-blue-600/20 transition"
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
