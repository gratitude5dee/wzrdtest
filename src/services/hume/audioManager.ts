export class AudioManager {
  private recorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;

  async startAudioCapture(onData: (data: Blob) => void) {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';

      this.recorder = new MediaRecorder(this.audioStream, { mimeType });
      
      this.recorder.ondataavailable = async ({ data }) => {
        if (data.size > 0) {
          onData(data);
        }
      };

      this.recorder.start(100);
    } catch (error) {
      console.error('Failed to start audio capture:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.recorder?.state === 'recording') {
      this.recorder.stop();
    }
    this.audioStream?.getTracks().forEach(track => track.stop());
    this.recorder = null;
    this.audioStream = null;
  }
}