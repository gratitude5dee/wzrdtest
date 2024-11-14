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
        "fixed bottom-0 left-0 right-0 bg-white/80 px-6 py-4",
        "flex items-center justify-between transition-all duration-300",
        "border-t border-gray-100 backdrop-blur-lg"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img src={activePersonality.icon} alt={activeCall} className="w-10 h-10" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium">{activeCall}</span>
          <span className="text-sm text-gray-500">{formatTime(callDuration)}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full",
            isMicMuted ? "bg-red-100 hover:bg-red-200" : "bg-gray-100 hover:bg-gray-200"
          )}
          onClick={onMicToggle}
        >
          {isMicMuted ? (
            <MicOff className="h-5 w-5 text-red-600" />
          ) : (
            <Mic className="h-5 w-5 text-gray-600" />
          )}
        </Button>
        <Button 
          variant="destructive"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onEndCall}
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}