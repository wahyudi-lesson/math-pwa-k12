// src/lib/evaluator.ts
import { Challenge, InteractionPayload, EvaluationResult } from '../types/math';

/**
 * Menghitung perolehan bintang berdasarkan jumlah percobaan (attempts)
 */
function calculateStars(attempts: number): 1 | 2 | 3 {
  if (attempts <= 1) return 3;
  if (attempts === 2) return 2;
  return 1;
}

/**
 * Mesin evaluasi universal untuk seluruh tipe alat interaktif dan mode pembelajaran
 */
export function evaluateInteraction(
  challenge: Challenge,
  payload: InteractionPayload,
  attempts: number
): EvaluationResult {
  const rules = challenge.validation;
  const currentTotal = payload.totalValue ?? 0;
  const currentCount = payload.placedCount ?? 0;
  const mode = challenge.activityMode || 'guided-practice';

  // 1. Validasi Kanvas Kosong
  if (currentCount === 0 && currentTotal === 0 && !payload.isComplete && !payload.equationString) {
    return {
      isCorrect: false,
      currentTotal: 0,
      currentPieceCount: 0,
      stars: 0,
      feedbackText: 'Papan masih kosong! Letakkan objek atau kepingan terlebih dahulu.',
      feedbackSpeech: 'Papan masih kosong! Letakkan objek atau kepingan terlebih dahulu.',
    };
  }

  // 2. Mode Eksplorasi (Bebas/Sandbox)
  // Pada mode ini, aktivitas anak selalu diapresiasi tanpa vonis salah atau penalti bintang
  if (mode === 'exploration') {
    return {
      isCorrect: true,
      currentTotal,
      currentPieceCount: currentCount,
      stars: 3,
      feedbackText: `Eksplorasi yang luar biasa! Kamu telah menemukan susunan dengan total ${currentTotal}.`,
      feedbackSpeech: `Eksplorasi yang luar biasa! Kamu telah menemukan susunan dengan total ${currentTotal}.`,
    };
  }

  // 3. Evaluasi Nilai Tepat ('exact-sum' & 'number-bond')
  if (rules.type === 'exact-sum' || rules.type === 'number-bond') {
    const target = rules.targetTotal ?? 0;

    if (currentTotal === target) {
      // Batasan minimal objek/keping
      if (rules.minPiecesAllowed && currentCount < rules.minPiecesAllowed) {
        return {
          isCorrect: false,
          currentTotal,
          currentPieceCount: currentCount,
          stars: 0,
          feedbackText: `Jumlah sudah ${target}, tetapi gunakan minimal ${rules.minPiecesAllowed} keping ya!`,
          feedbackSpeech: `Jumlah sudah ${target}, tetapi gunakan minimal ${rules.minPiecesAllowed} keping ya!`,
        };
      }

      // Batasan maksimal objek/keping
      if (rules.maxPiecesAllowed && currentCount > rules.maxPiecesAllowed) {
        return {
          isCorrect: false,
          currentTotal,
          currentPieceCount: currentCount,
          stars: 0,
          feedbackText: `Jumlah pas ${target}, tetapi gunakan tepat ${rules.maxPiecesAllowed} keping!`,
          feedbackSpeech: `Jumlah pas ${target}, tetapi gunakan tepat ${rules.maxPiecesAllowed} keping!`,
        };
      }

      const starsEarned = calculateStars(attempts);
      return {
        isCorrect: true,
        currentTotal,
        currentPieceCount: currentCount,
        stars: starsEarned,
        feedbackText: `Luar biasa! Target ${target} berhasil tercapai dengan sempurna!`,
        feedbackSpeech: `Luar biasa! Target ${target} berhasil tercapai dengan sempurna. Kamu mendapatkan ${starsEarned} bintang!`,
      };
    }

    // Umpan balik kekurangan atau kelebihan nilai
    const diff = Math.abs(target - currentTotal);
    const feedback =
      currentTotal < target
        ? `Total saat ini ${currentTotal}. Masih kurang ${diff} lagi untuk mencapai ${target}!`
        : `Total saat ini ${currentTotal}. Kelebihan ${diff}, coba kurangi objek di kanvas.`;

    return {
      isCorrect: false,
      currentTotal,
      currentPieceCount: currentCount,
      stars: 0,
      feedbackText: feedback,
      feedbackSpeech: feedback,
    };
  }

  // 4. Evaluasi Paritas Bilangan ('parity-check' - Ganjil / Genap)
  if (rules.type === 'parity-check') {
    const target = rules.targetTotal ?? 0;
    const isTargetEven = rules.requiredParity === 'even';
    const isTotalEven = currentTotal % 2 === 0;

    // Periksa paritas total
    const parityMismatch = isTargetEven ? !isTotalEven : isTotalEven;

    if (parityMismatch) {
      const parityWord = isTargetEven ? 'genap' : 'ganjil';
      const text = isTargetEven
        ? 'Total saat ini bernilai ganjil! Gunakan kombinasi keping genap yang tepinya rata.'
        : 'Total saat ini bernilai genap! Gunakan kombinasi keping ganjil yang memiliki tonjolan.';
      return {
        isCorrect: false,
        currentTotal,
        currentPieceCount: currentCount,
        stars: 0,
        feedbackText: text,
        feedbackSpeech: text,
      };
    }

    if (target > 0 && currentTotal !== target) {
      const parityWord = isTargetEven ? 'genap' : 'ganjil';
      const text = `Sifat keping sudah ${parityWord}, tetapi totalnya ${currentTotal}. Targetnya adalah ${target}.`;
      return {
        isCorrect: false,
        currentTotal,
        currentPieceCount: currentCount,
        stars: 0,
        feedbackText: text,
        feedbackSpeech: text,
      };
    }

    const starsEarned = calculateStars(attempts);
    return {
      isCorrect: true,
      currentTotal,
      currentPieceCount: currentCount,
      stars: starsEarned,
      feedbackText: `Bagus sekali! Kamu berhasil menyusun bilangan ${isTargetEven ? 'genap' : 'ganjil'} ${currentTotal}!`,
      feedbackSpeech: `Bagus sekali! Kamu berhasil menyusun bilangan ${isTargetEven ? 'genap' : 'ganjil'} ${currentTotal}!`,
    };
  }

  // 5. Evaluasi Pengisian Slot ('ten-frame-fill' & 'slot-fill')
  if (rules.type === 'ten-frame-fill' || rules.type === 'slot-fill') {
    const target = rules.targetTotal ?? 10;

    if (currentCount === target) {
      const starsEarned = calculateStars(attempts);
      return {
        isCorrect: true,
        currentTotal,
        currentPieceCount: currentCount,
        stars: starsEarned,
        feedbackText: `Hebat! Seluruh slot target ${target} berhasil terisi penuh!`,
        feedbackSpeech: `Hebat! Seluruh slot target ${target} berhasil terisi penuh!`,
      };
    }

    const remaining = target - currentCount;
    const text =
      remaining > 0
        ? `Masih ada ${remaining} slot kosong yang belum terisi.`
        : `Slot kelebihan ${Math.abs(remaining)} koin.`;

    return {
      isCorrect: false,
      currentTotal,
      currentPieceCount: currentCount,
      stars: 0,
      feedbackText: text,
      feedbackSpeech: text,
    };
  }

  // 6. Evaluasi Timbangan Keseimbangan ('balance-equilibrium')
  if (rules.type === 'balance-equilibrium') {
    if (payload.balanceStatus === 'balanced') {
      const starsEarned = calculateStars(attempts);
      return {
        isCorrect: true,
        currentTotal,
        currentPieceCount: currentCount,
        stars: starsEarned,
        feedbackText: 'Timbangan seimbang sempurna! Kedua sisi memiliki nilai yang sama.',
        feedbackSpeech: 'Timbangan seimbang sempurna! Kedua sisi memiliki nilai yang sama.',
      };
    }

    const text =
      payload.balanceStatus === 'left-heavy'
        ? 'Sisi kiri masih lebih berat. Seimbangkan timbangan!'
        : 'Sisi kanan masih lebih berat. Seimbangkan timbangan!';

    return {
      isCorrect: false,
      currentTotal,
      currentPieceCount: currentCount,
      stars: 0,
      feedbackText: text,
      feedbackSpeech: text,
    };
  }

  // 7. Evaluasi Penyusunan Kalimat Matematika ('correct-equation')
  if (rules.type === 'correct-equation') {
    if (payload.equationString && rules.targetEquation) {
      const isMatch =
        payload.equationString.replace(/\s+/g, '') === rules.targetEquation.replace(/\s+/g, '');

      if (isMatch) {
        const starsEarned = calculateStars(attempts);
        return {
          isCorrect: true,
          currentTotal,
          currentPieceCount: currentCount,
          stars: starsEarned,
          feedbackText: 'Persamaan matematikamu tepat sekali!',
          feedbackSpeech: 'Persamaan matematikamu tepat sekali!',
        };
      }
    }

    return {
      isCorrect: false,
      currentTotal,
      currentPieceCount: currentCount,
      stars: 0,
      feedbackText: 'Susunan persamaan belum tepat. Periksa kembali angka dan tandanya.',
      feedbackSpeech: 'Susunan persamaan belum tepat. Periksa kembali angka dan tandanya.',
    };
  }

  // 8. Evaluasi Menjodohkan Kartu ('matching-complete')
  if (rules.type === 'matching-complete') {
    const expected = rules.expectedPairsCount ?? 1;
    const matched = payload.matchedPairs?.length ?? 0;

    if (matched >= expected) {
      const starsEarned = calculateStars(attempts);
      return {
        isCorrect: true,
        currentTotal,
        currentPieceCount: currentCount,
        stars: starsEarned,
        feedbackText: 'Semua pasangan kartu berhasil dicocokkan dengan benar!',
        feedbackSpeech: 'Semua pasangan kartu berhasil dicocokkan dengan benar!',
      };
    }

    return {
      isCorrect: false,
      currentTotal,
      currentPieceCount: currentCount,
      stars: 0,
      feedbackText: `Baru ${matched} dari ${expected} pasangan yang cocok. Lanjutkan pencarianmu!`,
      feedbackSpeech: `Baru ${matched} dari ${expected} pasangan yang cocok. Lanjutkan pencarianmu!`,
    };
  }

  // Fallback Evaluasi Standar
  return {
    isCorrect: false,
    currentTotal,
    currentPieceCount: currentCount,
    stars: 0,
    feedbackText: 'Susunan belum memenuhi kriteria target tantangan ini.',
    feedbackSpeech: 'Susunan belum memenuhi kriteria target tantangan ini.',
  };
}
