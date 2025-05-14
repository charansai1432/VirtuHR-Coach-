export class SpeechService {
  private speechSynthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private isRecognizing: boolean = false;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;

    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }

    // Load available voices
    this.loadVoices();

    // Reload voices if they change
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    this.voices = this.speechSynthesis.getVoices();

    const femaleVoices = this.voices.filter(voice =>
      voice.name.includes('female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Veena') ||
      voice.name.includes('Tessa')
    );

    if (femaleVoices.length > 0) {
      this.preferredVoice = femaleVoices[0];
    } else if (this.voices.length > 0) {
      this.preferredVoice = this.voices[0];
    }
  }

  speak(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) return;

    this.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.speechSynthesis.speak(utterance);
  }

  startListening(onResult: (text: string) => void, onEnd?: () => void): void {
    if (!this.recognition) {
      console.error('Speech recognition not supported in this browser');
      if (onEnd) onEnd();
      return;
    }

    let finalTranscript = '';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      onResult(finalTranscript + interimTranscript);
    };

    this.recognition.onend = () => {
      this.isRecognizing = false;
      if (onEnd) {
        onEnd(); // This is called in your VoiceAssistant to trigger UI update
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isRecognizing = false;
      if (onEnd) onEnd();
    };

    this.recognition.start();
    this.isRecognizing = true;
  }

  stopListening(): void {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }

  stopSpeaking(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }
}

export const speechService = new SpeechService();
