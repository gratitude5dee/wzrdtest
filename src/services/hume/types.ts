export interface HumeMessage {
  type: 'transcript' | 'response' | 'interruption';
  text?: string;
  emotions?: Array<{
    name: string;
    score: number;
  }>;
}

export interface HumeConfig {
  voice: string;
  style: string;
  responseFormat: string;
}

export interface HumeCallbacks {
  onMessage: (message: any) => void;
  onError?: (error: Error) => void;
}