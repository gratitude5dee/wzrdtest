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
  private socket: WebSocket | null = null;
  private recorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private onMessageCallback: ((message: any) => void) | null = null;
  private currentSessionId: string | null = null;

  async connect(onMessage: (message: any) => void, personality: string) {
    try {
      const config = await this.getPersonalityConfig(personality);
      
      // Initialize WebSocket connection to Hume EVI
      this.socket = new WebSocket('wss://api.hume.ai/v0/evi/stream');
      this.onMessageCallback = onMessage;
      
      // Create a new voice session
      const session = await this.createVoiceSession(personality);
      this.currentSessionId = session.id;
      
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

  private async createVoiceSession(personality: string) {
    const { data: session, error } = await supabase
      .from('voice_sessions')
      .insert({
        personality,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  private async storeEmotionalResponse(
    emotions: Array<{ name: string; score: number }>,
    transcript: string,
    isUser: boolean
  ) {
    if (!this.currentSessionId) return;

    const { error } = await supabase
      .from('emotional_responses')
      .insert(
        emotions.map(emotion => ({
          session_id: this.currentSessionId,
          emotion_name: emotion.name,
          emotion_score: emotion.score,
          transcript,
          is_user_message: isUser
        }))
      );

    if (error) console.error('Failed to store emotional response:', error);
  }

  private async setupSocketHandlers(config: HumeConfig) {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('Connected to Hume EVI');
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
      const message: HumeMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'transcript':
          if (message.emotions && message.text) {
            await this.storeEmotionalResponse(message.emotions, message.text, true);
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
            await this.storeEmotionalResponse(message.emotions, message.text, false);
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
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';

      this.recorder = new MediaRecorder(this.audioStream, { mimeType });
      
      this.recorder.ondataavailable = async ({ data }) => {
        if (data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(data);
        }
      };

      this.recorder.start(100);
    } catch (error) {
      console.error('Failed to start audio capture:', error);
    }
  }

  async cleanup() {
    try {
      if (this.currentSessionId) {
        const { error } = await supabase
          .from('voice_sessions')
          .update({
            status: 'completed',
            end_time: new Date().toISOString(),
          })
          .eq('id', this.currentSessionId);

        if (error) console.error('Failed to update session status:', error);
      }

      if (this.recorder?.state === 'recording') {
        this.recorder.stop();
      }
      
      this.audioStream?.getTracks().forEach(track => track.stop());
      
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.close();
      }
      
      this.socket = null;
      this.recorder = null;
      this.audioStream = null;
      this.onMessageCallback = null;
      this.currentSessionId = null;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export const humeService = new HumeService();