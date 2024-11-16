import { Mic, Phone, MessageSquare, MicOff } from "lucide-react";
import { Button } from "../ui/button";

interface ChatControlsProps {
  isMicMuted: boolean;
  onMicToggle: () => void;
  onEndCall: () => void;
  onMessageClick: () => void;
}

export function ChatControls({ isMicMuted, onMicToggle, onEndCall, onMessageClick }: ChatControlsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center gap-8">
      <Button
        variant="secondary"
        size="lg"
        className="rounded-full p-6 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all"
        onClick={onMicToggle}
      >
        {isMicMuted ? (
          <MicOff className="h-6 w-6 text-gray-600" />
        ) : (
          <Mic className="h-6 w-6 text-gray-600" />
        )}
      </Button>
      
      <Button
        variant="destructive"
        size="lg"
        className="rounded-full p-6"
        onClick={onEndCall}
      >
        <Phone className="h-6 w-6 text-white" />
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        className="rounded-full p-6 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all"
        onClick={onMessageClick}
      >
        <MessageSquare className="h-6 w-6 text-gray-600" />
      </Button>
    </div>
  );
}