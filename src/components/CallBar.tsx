import { Phone, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useEffect, useRef } from "react";

interface CallBarProps {
  activeCall: string | null;
  isMicMuted: boolean;
  callDuration: number;
  onMicToggle: () => void;
  onEndCall: () => void;
  activePersonality: {
    icon: string;
    title: string;
  } | null;
}

export function CallBar({
  activeCall,
  isMicMuted,
  callDuration,
  onMicToggle,
  onEndCall,
  activePersonality
}: CallBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return;
      
      const rect = barRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = (e.clientX - centerX) * 0.05;
      const distanceY = (e.clientY - centerY) * 0.05;
      
      barRef.current.style.setProperty('--mouse-x', `${distanceX}px`);
      barRef.current.style.setProperty('--mouse-y', `${distanceY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!activeCall || !activePersonality) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div 
      ref={barRef}
      className={cn(
        "fixed bottom-8 left-4 right-4 animate-magnetic-float",
        "bg-gradient-to-r from-black/80 via-black/90 to-black/80",
        "backdrop-blur-xl rounded-2xl px-6 py-4",
        "border border-white/10",
        "flex items-center justify-between transition-all duration-300",
        "hover:border-white/20 hover:shadow-lg hover:-translate-y-1",
        "z-[100] group"
      )}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden animate-pulse-soft p-0.5">
          <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center p-2">
            <img src={activePersonality.icon} alt={activeCall} className="w-8 h-8" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-shift">
            {activeCall}
          </span>
          <span className="text-sm text-white/60">{formatTime(callDuration)}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          className={cn(
            "p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95",
            "bg-gradient-to-br hover:shadow-lg",
            isMicMuted 
              ? "from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30" 
              : "from-white/5 to-white/10 hover:from-white/10 hover:to-white/15",
            "group relative animate-glow"
          )}
          onClick={onMicToggle}
        >
          {isMicMuted ? (
            <MicOff className="h-5 w-5 text-red-400" />
          ) : (
            <Mic className="h-5 w-5 text-white" />
          )}
        </button>
        <button 
          onClick={onEndCall}
          className={cn(
            "p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95",
            "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
            "hover:shadow-lg hover:shadow-red-500/20",
            "group relative animate-glow"
          )}
        >
          <Phone className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}