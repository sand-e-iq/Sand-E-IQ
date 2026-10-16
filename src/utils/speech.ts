// Sand.E IQ - Voice Reading & Speech Synthesis Engine
// Supports English & Tamil text-to-speech with graceful fallback

class SpeechEngine {
  private isSpeakingInternal = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isAvailable()) return [];
    return window.speechSynthesis.getVoices();
  }

  public stop(): void {
    if (this.isAvailable()) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeakingInternal = false;
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    if (!this.isAvailable()) return false;
    return window.speechSynthesis.speaking || this.isSpeakingInternal;
  }

  public speak(
    text: string,
    lang: 'en' | 'ta' | string = 'en',
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.isAvailable()) {
      console.warn('SpeechSynthesis is not supported in this browser environment.');
      return false;
    }

    try {
      // Clean text of markdown asterisks and emojis for speech clarity
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#+/g, '')
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .trim();

      if (!cleanText) return false;

      // Stop any active speech before starting new one
      this.stop();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Select target voice if available
      const voices = this.getVoices();
      if (lang === 'ta') {
        utterance.lang = 'ta-IN';
        const taVoice = voices.find((v) => v.lang.startsWith('ta'));
        if (taVoice) utterance.voice = taVoice;
        utterance.rate = 0.9; // Slightly slower for clear Tamil articulation
      } else {
        utterance.lang = 'en-US';
        const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default));
        if (enVoice) utterance.voice = enVoice;
        utterance.rate = 1.0;
      }

      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      this.isSpeakingInternal = true;

      utterance.onend = () => {
        this.isSpeakingInternal = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeakingInternal = false;
        this.currentUtterance = null;
        if (onError) onError(e);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Speech synthesis error:', err);
      this.isSpeakingInternal = false;
      if (onError) onError(err);
      return false;
    }
  }
}

export const speech = new SpeechEngine();
