// src/hooks/useProgress.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { StudentTopicProgress, CurriculumTrack } from '../types/math';
import { getAllProgress, saveProgress, clearAllProgress } from '../lib/storage';

export interface StageProgressSummary {
  totalChallenges: number;
  completedCount: number;
  starsEarned: number;
  maxPossibleStars: number;
  completionPercentage: number;
}

export const useProgress = () => {
  const [progressMap, setProgressMap] = useState<Record<string, StudentTopicProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Mengambil ulang seluruh data progres dari IndexedDB ke memory state
   */
  const refreshProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProgress();
      setProgressMap(data);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Gagal memuat progres siswa.');
      setError(e);
      console.error('useProgress Error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Muat data saat hook pertama kali diinisialisasi
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  /**
   * Mencatat hasil pengerjaan tantangan:
   * - Mempertahankan perolehan bintang tertinggi (high score)
   * - Menghitung skor numerik berdasarkan bintang (3 -> 100, 2 -> 80, 1 -> 60)
   * - Menyimpan ke IndexedDB dan memperbarui state lokal secara reaktif
   */
  const recordResult = useCallback(
    async (
      challengeId: string,
      curriculum: CurriculumTrack,
      stage: string,
      stars: 1 | 2 | 3,
      attempts: number,
      timeSpentSeconds = 0
    ): Promise<StudentTopicProgress> => {
      const existing = progressMap[challengeId];
      const highestStars = Math.max(stars, existing?.starsEarned || 0) as 1 | 2 | 3;

      // Konversi bintang ke skor persentase
      const score = highestStars === 3 ? 100 : highestStars === 2 ? 80 : 60;

      const updatedProgress: StudentTopicProgress = {
        challengeId,
        curriculum,
        stage,
        completed: true,
        starsEarned: highestStars,
        score,
        attemptsCount: (existing?.attemptsCount || 0) + attempts,
        timeSpentSeconds: (existing?.timeSpentSeconds || 0) + timeSpentSeconds,
        lastAttemptTimestamp: Date.now(),
      };

      try {
        await saveProgress(updatedProgress);
        setProgressMap((prev) => ({
          ...prev,
          [challengeId]: updatedProgress,
        }));
        return updatedProgress;
      } catch (err) {
        console.error(`Gagal menyimpan progres untuk tantangan ${challengeId}:`, err);
        throw err;
      }
    },
    [progressMap]
  );

  /**
   * Mengambil progres satu tantangan spesifik
   */
  const getProgress = useCallback(
    (challengeId: string): StudentTopicProgress | undefined => {
      return progressMap[challengeId];
    },
    [progressMap]
  );

  /**
   * Mengecek apakah satu tantangan sudah diselesaikan
   */
  const isCompleted = useCallback(
    (challengeId: string): boolean => {
      return Boolean(progressMap[challengeId]?.completed);
    },
    [progressMap]
  );

  /**
   * Mengambil jumlah perolehan bintang untuk satu tantangan (0 jika belum selesai)
   */
  const getStars = useCallback(
    (challengeId: string): 0 | 1 | 2 | 3 => {
      return (progressMap[challengeId]?.starsEarned || 0) as 0 | 1 | 2 | 3;
    },
    [progressMap]
  );

  /**
   * Menghitung ringkasan statistik progres untuk jenjang/stage tertentu
   */
  const getStageSummary = useCallback(
    (
      curriculum: CurriculumTrack,
      stage: string,
      totalChallengesInStage: number
    ): StageProgressSummary => {
      const stageRecords = Object.values(progressMap).filter(
        (item) =>
          item.curriculum === curriculum &&
          item.stage.toLowerCase() === stage.toLowerCase() &&
          item.completed
      );

      const completedCount = stageRecords.length;
      const starsEarned = stageRecords.reduce((sum, item) => sum + (item.starsEarned || 0), 0);
      const maxPossibleStars = totalChallengesInStage * 3;
      const completionPercentage =
        totalChallengesInStage > 0
          ? Math.round((completedCount / totalChallengesInStage) * 100)
          : 0;

      return {
        totalChallenges: totalChallengesInStage,
        completedCount,
        starsEarned,
        maxPossibleStars,
        completionPercentage,
      };
    },
    [progressMap]
  );

  /**
   * Menghapus seluruh riwayat progres (reset data belajar)
   */
  const resetAllProgress = useCallback(async () => {
    try {
      setLoading(true);
      await clearAllProgress();
      setProgressMap({});
    } catch (err) {
      console.error('Gagal mereset progres:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Total seluruh bintang yang dikumpulkan siswa di semua kurikulum
   */
  const totalStars = useMemo(() => {
    return Object.values(progressMap).reduce((sum, item) => sum + (item.starsEarned || 0), 0);
  }, [progressMap]);

  /**
   * Total seluruh tantangan yang sudah diselesaikan
   */
  const totalCompleted = useMemo(() => {
    return Object.values(progressMap).filter((item) => item.completed).length;
  }, [progressMap]);

  return {
    progressMap,
    loading,
    error,
    totalStars,
    totalCompleted,
    recordResult,
    getProgress,
    isCompleted,
    getStars,
    getStageSummary,
    refreshProgress,
    resetAllProgress,
  };
};
