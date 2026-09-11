/**
 * TARANG Audio Service
 * 
 * Voices are pre-loaded once. Playback is synchronous in the click handler.
 * This is required because speechSynthesis.speak() must be called within
 * the same synchronous call stack as a user gesture on most browsers.
 */

export type AudioLang = 'en' | 'hi';

const LANG_CONFIG: Record<AudioLang, { locale: string; rate: number; pitch: number }> = {
  en: { locale: 'en-IN', rate: 1.0,  pitch: 1.0 },
  hi: { locale: 'hi-IN', rate: 0.88, pitch: 1.0 },
};

// Cache voices once they are loaded
let _voices: SpeechSynthesisVoice[] = [];
let _voicesLoaded = false;

/**
 * Pre-loads all available voices and caches them.
 * Call this once on app init or component mount.
 */
export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const current = window.speechSynthesis.getVoices();
    if (current.length > 0) {
      _voices = current;
      _voicesLoaded = true;
      resolve(_voices);
      return;
    }
    const handler = () => {
      _voices = window.speechSynthesis.getVoices();
      _voicesLoaded = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(_voices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Safety: resolve after 3s even if event never fires
    setTimeout(() => {
      if (!_voicesLoaded) {
        _voices = window.speechSynthesis.getVoices();
        _voicesLoaded = true;
        resolve(_voices);
      }
    }, 3000);
  });
}

/**
 * Returns the cached voices list.
 */
export function getCachedVoices(): SpeechSynthesisVoice[] {
  return _voices;
}

/**
 * Finds the best voice for a given language from the cached voices.
 * STRICT: Never returns an English voice for Hindi.
 */
export function findVoice(lang: AudioLang): SpeechSynthesisVoice | null {
  const voices = _voices;

  if (lang === 'en') {
    return (
      voices.find(v => v.lang.toLowerCase() === 'en-in') ||
      voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
      null
    );
  }

  if (lang === 'hi') {
    return (
      voices.find(v => v.lang.toLowerCase() === 'hi-in') ||
      voices.find(v => v.lang.toLowerCase().startsWith('hi')) ||
      voices.find(v => v.name.toLowerCase().includes('hindi')) ||
      null
    );
  }

  return null;
}

/**
 * Returns true if a native Hindi voice is available.
 * Must be called after preloadVoices() has resolved.
 */
export function isHindiVoiceAvailable(): boolean {
  return findVoice('hi') !== null;
}

/**
 * SYNCHRONOUS play function — must be called directly from a user gesture.
 * Do NOT await anything before calling this in a click handler.
 */
export function playAudio(
  text: string,
  lang: AudioLang,
  onEnd: () => void,
  onError: (msg: string) => void
): void {
  if (!('speechSynthesis' in window)) {
    onError('Audio is unavailable on this device.');
    return;
  }

  window.speechSynthesis.cancel();

  const config = LANG_CONFIG[lang];
  const voice = findVoice(lang);
  console.log(`[TARANG Audio] Selected voice: ${voice?.name || 'none'} (${voice?.lang || 'none'}) for lang=${lang}`);
  
  // Strict validation for Hindi: ensure the chosen voice actually supports Hindi
  if (lang === 'hi' && (!voice || !voice.lang.toLowerCase().startsWith('hi'))) {
    console.error('[TARANG Audio] No suitable Hindi voice found; aborting playback');
    onError('Hindi audio is not available on this device.');
    return;
  }

  // Debug log the text being spoken
  console.log('[TARANG Audio] Text content length:', text.length);
  console.log('[TARANG Audio] Text preview:', text.slice(0, 100));

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = config.locale;
  utterance.rate = config.rate;
  utterance.pitch = config.pitch;
  utterance.volume = 1.0;

  if (voice) {
    utterance.voice = voice;
    console.log(`[TARANG Audio] Using voice: ${voice.name} (${voice.lang}) for lang=${lang}`);
  }

  utterance.onend = onEnd;
  utterance.onerror = (e) => {
    if (e.error === 'canceled' || e.error === 'interrupted') {
      onEnd();
      return;
    }
    console.error('[TARANG Audio] TTS error:', e.error);
    onError('Audio playback encountered an error.');
  };

  // This must be synchronous — do not put any await before this call
  window.speechSynthesis.speak(utterance);
}

export function stopAudio() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
