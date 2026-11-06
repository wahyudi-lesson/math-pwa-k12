// src/lib/audio.ts
import { SoundEffectType, TTSInstruction } from '../types/math';

/**
 * Pengelola AudioContext global untuk Web Audio API.
 * Diinisialisasi secara lazy agar mematuhi kebijakan autoplay browser modern.
 */
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  // Resume context jika dalam status suspended (kebijakan browser sebelum ada interaksi pengguna)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
};

// ============================================================================
// 1. WEB AUDIO API SYNTHESIZER (Tanpa File Eksternal / 100% Offline PWA)
// ============================================================================

/**
 * Memainkan efek suara sintetis instan berbasis synthesizer Web Audio API.
 */
export const playSoundEffect = (type: SoundEffectType, volume = 0.3): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), now);

  switch (type) {
    case 'snap': {
      // Efek snap magnetik kepingan: pop/click tajam berfrekuensi turun cepat
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
      break;
    }

    case 'tap': {
      // Efek ketukan lembut saat rotasi atau klik tombol antarmuka
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
      break;
    }

    case 'correct': {
      // Akord arpeggio ceria (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, index) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const noteStart = now + index * 0.08;
        const noteDuration = 0.25;

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, noteStart);

        noteGain.gain.setValueAtTime(0, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.5, noteStart + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        noteOsc.connect(noteGain);
        noteGain.connect(masterGain);

        noteOsc.start(noteStart);
        noteOsc.stop(noteStart + noteDuration);
      });
      break;
    }

    case 'wrong': {
      // Nada lembut ganda menurun (ramah anak, tidak mengejutkan atau menghukum)
      const freqs = [220, 185];
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + index * 0.12;
        const duration = 0.18;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(start);
        osc.stop(start + duration);
      });
      break;
    }

    case 'celebrate': {
      // Fanfare kemenangan bintang 3: Arpeggio menaik C-E-G-C6 dengan aksen sparkle
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + index * 0.09;
        const duration = 0.45;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.6, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(start);
        osc.stop(start + duration);
      });
      break;
    }
  }
};

// ============================================================================
// 2. TEXT-TO-SPEECH (TTS) DENGAN WEB SPEECH API
// ============================================================================

interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

/**
 * Mencari suara sistem terbaik yang cocok dengan bahasa target.
 */
const findBestVoice = (lang: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  const normalizedLang = lang.toLowerCase();

  // 1. Prioritaskan suara natural/lokal yang persis cocok
  const exactMatch = voices.find(
    (v) => v.lang.toLowerCase().replace('_', '-') === normalizedLang
  );
  if (exactMatch) return exactMatch;

  // 2. Fallback ke bahasa dasar (misal 'id' dari 'id-ID')
  const baseLang = normalizedLang.split('-')[0];
  const baseMatch = voices.find((v) => v.lang.toLowerCase().startsWith(baseLang));
  if (baseMatch) return baseMatch;

  return null;
};

/**
 * Membaca teks instruksi bersuara dengan pembatalan otomatis antrean lama.
 * Mendukung input berupa string langsung atau objek konfigurasi TTSInstruction.
 */
export const speakInstruction = (
  instruction: string | TTSInstruction,
  callbacks?: SpeechCallbacks
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks?.onEnd?.();
    return;
  }

  // Batalkan suara yang sedang berjalan agar tidak bertumpuk
  window.speechSynthesis.cancel();

  const textToRead = typeof instruction === 'string'
    ? instruction
    : instruction.speechText || instruction.text;

  if (!textToRead.trim()) {
    callbacks?.onEnd?.();
    return;
  }

  const lang = typeof instruction === 'string' ? 'id-ID' : instruction.lang || 'id-ID';
  const rate = typeof instruction === 'string' ? 0.85 : instruction.rate ?? 0.85;
  const pitch = typeof instruction === 'string' ? 1.05 : instruction.pitch ?? 1.05;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voice = findBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    callbacks?.onEnd?.();
  };

  utterance.onerror = (e) => {
    callbacks?.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Menghentikan semua aktivitas pembacaan suara saat ini.
 */
export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Mengecek apakah TTS sedang aktif berbicara.
 */
export const isSpeaking = (): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
};
