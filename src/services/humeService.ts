import { Hume } from 'hume';

class HumeService {
  private client: Hume;
  private socket: any;
  private audioQueue: Blob[] = [];
  private isPlaying = false;
  private currentAudio: HTMLAudioElement | null = null;
  private recorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor() {
    this.client = new Hume({
      apiKey: import.meta.env.VITE_HUME_API_KEY || '',
      baseUrl: 'wss://api.hume.ai/v0/evi/stream'
    });
  }

  async connect(onMessage: (message: any) => void, personality: string) {
    try {
      // Configure EVI based on personality
      const config = this.getPersonalityConfig(personality);
      
      this.socket = await this.client.stream.connect({
        ...config,
        language: 'en',
        enableVAD: true, // Voice Activity Detection
        enableInterruption: true,
      });

      this.onMessageCallback = onMessage;
      this.setupSocketHandlers();
      await this.startAudioCapture();
      return true;
    } catch (error) {
      console.error('Failed to connect to Hume:', error);
      return false;
    }
  }

  private getPersonalityConfig(personality: string) {
    switch (personality) {
      case 'emotional-reflection':
        return {
          voice: 'dacher',
          style: 'empathetic',
          responseFormat: 'conversational'
        };
      case 'life-advice':
        return {
          voice: 'sarah',
          style: 'therapeutic',
          responseFormat: 'structured'
        };
      case 'storytelling':
        return {
          voice: 'james',
          style: 'narrative',
          responseFormat: 'creative'
        };
      default:
        return {
          voice: 'default',
          style: 'balanced',
          responseFormat: 'conversational'
        };
    }
  }

  private setupSocketHandlers() {
    if (!this.socket) return;

    this.socket.on('transcript', (message: any) => {
      this.onMessageCallback?.({
        type: 'user_message',
        transcript: message.text,
        expressions: message.emotions
      });
    });

    this.socket.on('response', (message: any) => {
      this.onMessageCallback?.({
        type: 'assistant_message',
        text: message.text,
        expressions: message.emotions
      });
    });

    this.socket.on('interruption', () => {
      this.onMessageCallback?.({
        type: 'user_interruption'
      });
    });

    this.socket.on('error', (error: any) => {
      console.error('Hume socket error:', error);
    });
  }

  private async startAudioCapture() {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';

      this.recorder = new MediaRecorder(this.audioStream, { mimeType });
      
      this.recorder.ondataavailable = async ({ data }) => {
        if (data.size > 0 && this.socket) {
          await this.socket.sendAudio(data);
        }
      };

      this.recorder.start(100); // Send audio chunks every 100ms
    } catch (error) {
      console.error('Failed to start audio capture:', error);
    }
  }

  cleanup() {
    this.recorder?.stop();
    this.audioStream?.getTracks().forEach(track => track.stop());
    this.socket?.disconnect();
    this.socket = null;
    this.currentAudio?.pause();
    this.currentAudio = null;
    this.isPlaying = false;
    this.audioQueue = [];
  }
}

export const humeService = new HumeService();