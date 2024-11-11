import { Mic, Phone, MessageSquare, MicOff } from "lucide-react";

interface ChatControlsProps {
  isMicMuted: boolean;
  onMicToggle: () => void;
  onEndCall: () => void;
  onMessageClick: () => void;
}

export function ChatControls({ isMicMuted, onMicToggle, onEndCall, onMessageClick }: ChatControlsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center gap-6">
      <button 
        onClick={onMicToggle}
        className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all"
      >
        {isMicMuted ? (
          <MicOff className="h-6 w-6 text-gray-600" />
        ) : (
          <Mic className="h-6 w-6 text-gray-600" />
        )}
      </button>
      <button 
        onClick={onEndCall}
        className="p-4 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transition-colors"
      >
        <Phone className="h-6 w-6 text-white" />
      </button>
      <button 
        onClick={onMessageClick}
        className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all"
      >
        <MessageSquare className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
}