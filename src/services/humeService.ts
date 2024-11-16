import { Hume, HumeClient } from 'hume';

class HumeService {
  private client: HumeClient;
  private socket: any;
  private audioQueue: Blob[] = [];
  private isPlaying = false;
  private currentAudio: HTMLAudioElement | null = null;
  private recorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor() {
    this.client = new HumeClient({
      apiKey: import.meta.env.VITE_HUME_API_KEY || '',
      secretKey: import.meta.env.VITE_HUME_SECRET_KEY || '',
    });
  }

  async connect(onMessage: (message: any) => void) {
    try {
      this.socket = await this.client.empathicVoice.chat.connect({
        configId: import.meta.env.VITE_HUME_CONFIG_ID || null,
      });

      this.onMessageCallback = onMessage;
      this.setupSocketHandlers();
      return true;
    } catch (error) {
      console.error('Failed to connect to Hume:', error);
      return false;
    }
  }

  private setupSocketHandlers() {
    this.socket.on('open', this.handleWebSocketOpen);
    this.socket.on('message', this.handleWebSocketMessage);
    this.socket.on('error', this.handleWebSocketError);
    this.socket.on('close', this.handleWebSocketClose);
  }

  private handleWebSocketOpen = async () => {
    console.log('WebSocket connection opened');
    await this.startAudioCapture();
  };

  private handleWebSocketMessage = (message: Hume.empathicVoice.SubscribeEvent) => {
    switch (message.type) {
      case 'audio_output':
        this.handleAudioOutput(message.data);
        break;
      case 'user_interruption':
        this.stopAudio();
        break;
      default:
        this.onMessageCallback?.(message);
    }
  };

  private handleWebSocketError = (error: any) => {
    console.error('WebSocket error:', error);
  };

  private handleWebSocketClose = () => {
    this.cleanup();
  };

  private async startAudioCapture() {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';

      this.recorder = new MediaRecorder(this.audioStream, { mimeType });
      this.recorder.ondataavailable = async ({ data }) => {
        if (data.size < 1) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result?.toString().split(',')[1];
          if (base64data) {
            this.socket?.sendAudioInput({ data: base64data });
          }
        };
        reader.readAsDataURL(data);
      };

      this.recorder.start(100);
    } catch (error) {
      console.error('Failed to start audio capture:', error);
    }
  }

  private handleAudioOutput(audioData: string) {
    const blob = this.base64ToBlob(audioData, 'audio/webm');
    this.audioQueue.push(blob);
    if (this.audioQueue.length === 1) {
      this.playNextAudio();
    }
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type });
  }

  private playNextAudio() {
    if (!this.audioQueue.length || this.isPlaying) return;

    this.isPlaying = true;
    const audioBlob = this.audioQueue.shift();
    if (!audioBlob) return;

    const audioUrl = URL.createObjectURL(audioBlob);
    this.currentAudio = new Audio(audioUrl);
    this.currentAudio.play();
    this.currentAudio.onended = () => {
      this.isPlaying = false;
      URL.revokeObjectURL(audioUrl);
      if (this.audioQueue.length) {
        this.playNextAudio();
      }
    };
  }

  stopAudio() {
    this.currentAudio?.pause();
    this.currentAudio = null;
    this.isPlaying = false;
    this.audioQueue = [];
  }

  cleanup() {
    this.stopAudio();
    this.recorder?.stop();
    this.audioStream?.getTracks().forEach(track => track.stop());
    this.socket?.close();
  }
}

export const humeService = new HumeService();