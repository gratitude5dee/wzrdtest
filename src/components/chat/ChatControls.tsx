import { Mic, Phone, MessageSquare, MicOff } from "lucide-react";

interface ChatControlsProps {
  isMicMuted: boolean;
  onMicToggle: () => void;
  onEndCall: () => void;
  onMessageClick: () => void;
}

export function ChatControls({ isMicMuted, onMicToggle, onEndCall, onMessageClick }: ChatControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent">
      <div className="flex justify-around items-center">
        <button 
          onClick={onMicToggle}
          className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm relative"
        >
          {isMicMuted ? (
            <MicOff className="h-6 w-6 text-gray-600" />
          ) : (
            <Mic className="h-6 w-6 text-gray-600" />
          )}
        </button>
        <button 
          onClick={onEndCall}
          className="p-4 rounded-full bg-red-500 shadow-sm hover:bg-red-600 transition-colors"
        >
          <Phone className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={onMessageClick}
          className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <MessageSquare className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/* Home Indicator */}
      <div className="mt-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full opacity-20" />
      </div>
    </div>
  );
}