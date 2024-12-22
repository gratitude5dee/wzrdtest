import { supabase } from "@/integrations/supabase/client";
import { HumeConfig, HumeCallbacks } from "./types";
import { SessionManager } from "./sessionManager";
import { AudioManager } from "./audioManager";

class HumeService {
  private socket: WebSocket | null = null;
  private sessionManager: SessionManager;
  private audioManager: AudioManager;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor() {
    this.sessionManager = new SessionManager();
    this.audioManager = new AudioManager();
  }

  async connect(onMessage: (message: any) => void, personality: string) {
    try {
      const config = await this.getPersonalityConfig(personality);
      
      // Initialize WebSocket connection to Hume MVI
      this.socket = new WebSocket('wss://api.hume.ai/v0/mvi/stream');
      this.onMessageCallback = onMessage;
      
      // Create a new voice session
      await this.sessionManager.createVoiceSession(personality);
      
      await this.setupSocketHandlers(config);
      await this.startAudioCapture();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Hume:', error);
      return false;
    }
  }

  private async getPersonalityConfig(personality: string): Promise<HumeConfig> {
    const { data: config, error } = await supabase
      .from('personality_configs')
      .select('*')
      .eq('personality_id', personality)
      .single();

    if (error || !config) {
      return {
        voice: 'default',
        style: 'balanced',
        responseFormat: 'conversational'
      };
    }

    return {
      voice: config.voice,
      style: config.style,
      responseFormat: config.response_format
    };
  }

  private async setupSocketHandlers(config: HumeConfig) {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('Connected to Hume MVI');
      if (this.socket) {
        this.socket.send(JSON.stringify({
          type: 'config',
          ...config,
          language: 'en',
          enableVAD: true,
          enableInterruption: true
        }));
      }
    };

    this.socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'transcript':
          if (message.emotions && message.text) {
            await this.sessionManager.storeEmotionalResponse(message.emotions, message.text, true);
          }
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
          if (message.emotions && message.text) {
            await this.sessionManager.storeEmotionalResponse(message.emotions, message.text, false);
          }
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
    await this.audioManager.startAudioCapture((data) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(data);
      }
    });
  }

  async cleanup() {
    try {
      await this.sessionManager.completeSession();
      this.audioManager.cleanup();
      
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.close();
      }
      
      this.socket = null;
      this.onMessageCallback = null;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export const humeService = new HumeService();