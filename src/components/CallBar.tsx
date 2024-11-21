import { Mic, MicOff, Phone, AudioWaveform } from 'lucide-react';

interface CallBarProps {
  activeCall: string | null;
  isMicMuted: boolean;
  callDuration: number;
  onMicToggle: () => void;
  onEndCall: () => void;
  setCallDuration: (duration: number) => void;
}

export function CallBar({
  activeCall,
  isMicMuted,
  onMicToggle,
  onEndCall,
}: CallBarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
      <button
        onClick={onMicToggle}
        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>
      
      <button
        onClick={onEndCall}
        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300"
      >
        <Phone className="h-7 w-7" />
      </button>
      
      <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
        <AudioWaveform className="h-6 w-6" />
      </button>
    </div>
  );
}