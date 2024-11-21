import { useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CallBarProps {
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
  callDuration,
  onMicToggle,
  onEndCall,
  setCallDuration,
}: CallBarProps) {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration(callDuration + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeCall, callDuration, setCallDuration]);

  if (!activeCall) return null;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/20">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">
                {activeCall}
              </span>
            </div>
            <span className="text-white/60 text-sm">
              {formatDuration(callDuration)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMicToggle}
              className={cn(
                "rounded-full hover:bg-white/10",
                isMicMuted ? "text-red-500" : "text-white"
              )}
            >
              {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEndCall}
              className="rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}