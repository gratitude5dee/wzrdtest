import { Mic, MicOff, Phone, WaveformIcon } from 'lucide-react';

interface CallBarProps {
  isMicMuted: boolean;
  onMicToggle: () => void;
  onEndCall: () => void;
}

export function CallBar({
  isMicMuted,
  onMicToggle,
  onEndCall,
}: CallBarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-8">
      <button
        onClick={onMicToggle}
        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>
      
      <button
        onClick={onEndCall}
        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
      >
        <Phone className="h-7 w-7" />
      </button>
      
      <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
        <WaveformIcon className="h-6 w-6" />
      </button>
    </div>
  );
}