import { Phone, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

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
  if (!activeCall || !activePersonality) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn(
        "fixed bottom-8 left-4 right-4 bg-white/80 rounded-full shadow-lg px-6 py-4",
        "flex items-center justify-between transition-all duration-300 transform",
        "hover:shadow-xl hover:-translate-y-1",
        "z-[100] border border-gray-100"
      )}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden animate-pulse-soft">
          <img src={activePersonality.icon} alt={activeCall} className="w-10 h-10" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium gradient-text">{activeCall}</span>
          <span className="text-sm text-gray-500">{formatTime(callDuration)}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          className={cn(
            "p-4 rounded-full transition-all duration-300 magnetic-button",
            isMicMuted ? "bg-red-100 hover:bg-red-200" : "bg-gray-100 hover:bg-gray-200"
          )}
          onClick={onMicToggle}
        >
          {isMicMuted ? (
            <MicOff className="h-5 w-5 text-red-600" />
          ) : (
            <Mic className="h-5 w-5 text-gray-600" />
          )}
        </button>
        <button 
          onClick={onEndCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors magnetic-button"
        >
          <Phone className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}