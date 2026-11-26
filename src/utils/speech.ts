export interface SpeechOptions {
  rate?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function playFallbackTone(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 350);
  } catch {
    // Ignore audio context errors when blocked
  }
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speakEnglish(text: string, options: SpeechOptions = {}): void {
  const { rate = 0.95, lang = 'en-US', onStart, onEnd, onError } = options;

  if (!isSpeechSupported()) {
    onStart?.();
    playFallbackTone();
    setTimeout(() => {
      onEnd?.();
    }, 600);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === 'en-US' && v.localService) ||
      voices.find((v) => v.lang.startsWith('en-US')) ||
      voices.find((v) => v.lang.startsWith('en-GB')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    let settled = false;
    const safetyTimer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        onEnd?.();
      }
    }, Math.max(1800, text.length * 140));

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      if (!settled) {
        settled = true;
        window.clearTimeout(safetyTimer);
        onEnd?.();
      }
    };

    utterance.onerror = () => {
      if (!settled) {
        settled = true;
        window.clearTimeout(safetyTimer);
        playFallbackTone();
        onError?.();
        onEnd?.();
      }
    };

    onStart?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    onStart?.();
    playFallbackTone();
    setTimeout(() => {
      onEnd?.();
    }, 500);
  }
}
