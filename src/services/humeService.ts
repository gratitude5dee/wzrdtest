import { createClient } from '@humeai/client';

interface HumeMessage {
  type: 'transcript' | 'response' | 'interruption';
  text?: string;
  emotions?: Array<{
    name: string;
    score: number;
  }>;
}

interface HumeConfig {
  voice: string;
  style: string;
  responseFormat: string;
}

class HumeService {
  private client: any;
  private socket: WebSocket | null = null;
  private recorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor() {
    this.client = createClient(import.meta.env.VITE_HUME_API_KEY || '');
  }

  async connect(onMessage: (message: any) => void, personality: string) {
    try {
      const config = this.getPersonalityConfig(personality);
      
      // Initialize WebSocket connection to Hume EVI
      this.socket = new WebSocket('wss://api.hume.ai/v0/evi/stream');
      this.onMessageCallback = onMessage;
      
      await this.setupSocketHandlers(config);
      await this.startAudioCapture();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Hume:', error);
      return false;
    }
  }

  private getPersonalityConfig(personality: string): HumeConfig {
    const configs: { [key: string]: HumeConfig } = {
      'emotional-reflection': {
        voice: 'dacher',
        style: 'empathetic',
        responseFormat: 'conversational'
      },
      'life-advice': {
        voice: 'sarah',
        style: 'therapeutic',
        responseFormat: 'structured'
      },
      'storytelling': {
        voice: 'james',
        style: 'narrative',
        responseFormat: 'creative'
      }
    };

    return configs[personality] || {
      voice: 'default',
      style: 'balanced',
      responseFormat: 'conversational'
    };
  }

  private async setupSocketHandlers(config: HumeConfig) {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('Connected to Hume EVI');
      // Send configuration
      this.socket.send(JSON.stringify({
        type: 'config',
        ...config,
        language: 'en',
        enableVAD: true,
        enableInterruption: true
      }));
    };

    this.socket.onmessage = (event) => {
      const message: HumeMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'transcript':
          this.onMessageCallback?.({
            type: 'user_message',
            transcript: message.text,
            expressions: message.emotions?.map(e => ({
              name: e.name,
              score: e.score
            }))
          });
          break;
        
        case 'response':
          this.onMessageCallback?.({
            type: 'assistant_message',
            text: message.text,
            expressions: message.emotions?.map(e => ({
              name: e.name,
              score: e.score
            }))
          });
          break;
        
        case 'interruption':
          this.onMessageCallback?.({
            type: 'user_interruption'
          });
          break;
      }
    };

    this.socket.onerror = (error) => {
      console.error('Hume socket error:', error);
    };
  }

  private async startAudioCapture() {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';

      this.recorder = new MediaRecorder(this.audioStream, { mimeType });
      
      this.recorder.ondataavailable = async ({ data }) => {
        if (data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(data);
        }
      };

      this.recorder.start(100); // Send audio chunks every 100ms
    } catch (error) {
      console.error('Failed to start audio capture:', error);
    }
  }

  cleanup() {
    // Stop recording
    if (this.recorder?.state === 'recording') {
      this.recorder.stop();
    }
    
    // Stop all audio tracks
    this.audioStream?.getTracks().forEach(track => track.stop());
    
    // Close WebSocket connection
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    
    // Reset all instance variables
    this.socket = null;
    this.recorder = null;
    this.audioStream = null;
    this.onMessageCallback = null;
  }
}

export const humeService = new HumeService();