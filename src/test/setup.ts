// src/test/setup.ts
import 'fake-indexeddb/auto';

// Mock Web Speech API untuk lingkungan Node.js/JSDOM
if (typeof window !== 'undefined') {
  window.speechSynthesis = {
    cancel: () => {},
    speak: () => {},
    getVoices: () => [],
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null,
    pause: () => {},
    resume: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as SpeechSynthesis;

  window.SpeechSynthesisUtterance = class {
    text = '';
    lang = '';
    rate = 1;
    pitch = 1;
    volume = 1;
    voice = null;
    onstart = null;
    onend = null;
    onerror = null;
    onpause = null;
    onresume = null;
    onmark = null;
    onboundary = null;
    addEventListener = () => {};
    removeEventListener = () => {};
    dispatchEvent = () => false;
  } as unknown as typeof SpeechSynthesisUtterance;
}
