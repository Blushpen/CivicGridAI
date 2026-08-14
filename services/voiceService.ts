export interface VoiceCaptureResult {
  text: string;
  language?: string;
  isFallback: boolean;
  source: 'speech' | 'text' | 'fallback';
  error?: string;
}

export interface VoiceInputProvider {
  isSupported: () => boolean;
  start: (options?: { language?: string }) => Promise<{ transcript?: string }>;
}

export class VoiceInputService {
  constructor(private provider?: VoiceInputProvider) {}

  async captureVoiceInput(
    incomingText?: string,
    options?: { language?: string }
  ): Promise<VoiceCaptureResult> {
    const text = (incomingText ?? '').trim();

    if (text) {
      return {
        text,
        language: options?.language ?? 'en',
        isFallback: false,
        source: 'text',
      };
    }

    const recognizer = this.provider ?? this.getBrowserProvider();

    if (!recognizer || !recognizer.isSupported()) {
      return {
        text: '',
        language: options?.language ?? 'en',
        isFallback: true,
        source: 'fallback',
        error: 'Voice input is not available in this browser or device.',
      };
    }

    try {
      const result = await recognizer.start({ language: options?.language ?? 'en' });
      const transcript = (result?.transcript ?? '').trim();

      if (!transcript) {
        return {
          text: '',
          language: options?.language ?? 'en',
          isFallback: true,
          source: 'fallback',
          error: 'No speech was detected. Please enter the issue description manually.',
        };
      }

      return {
        text: transcript,
        language: options?.language ?? 'en',
        isFallback: false,
        source: 'speech',
      };
    } catch {
      return {
        text: '',
        language: options?.language ?? 'en',
        isFallback: true,
        source: 'fallback',
        error: 'Speech recognition failed. Please type the issue description instead.',
      };
    }
  }

  private getBrowserProvider(): VoiceInputProvider | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const browserWindow = window as typeof window & {
      webkitSpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: ((event: { error?: string }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
      SpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: ((event: { error?: string }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
    };

    const SpeechRecognitionCtor = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      return null;
    }

    return {
      isSupported: () => true,
      start: async ({ language = 'en' } = {}) => {
        return new Promise<{ transcript?: string }>((resolve) => {
          const recognition = new SpeechRecognitionCtor() as {
            continuous: boolean;
            interimResults: boolean;
            lang: string;
            onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
            onerror: ((event: { error?: string }) => void) | null;
            onend: (() => void) | null;
            start: () => void;
          };

          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = language;
          recognition.onresult = (event) => {
            const result = event.results[0]?.[0]?.transcript ?? '';
            resolve({ transcript: result });
          };
          recognition.onerror = () => resolve({ transcript: '' });
          recognition.onend = () => resolve({ transcript: '' });
          recognition.start();
        });
      },
    };
  }
}

export const voiceInputService = new VoiceInputService();
