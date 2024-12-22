import { ChatMessage } from "./ChatMessage";
import { CallBar } from "../CallBar";
import { MessageSquare, ArrowLeft, Info } from 'lucide-react';
import { Button } from "../ui/button";

interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
  isInterruption?: boolean;
  timestamp?: string;
}

interface ChatViewProps {
  messages: Message[];
  isListening: boolean;
  personality: string;
  isMicMuted: boolean;
  onMicToggle: () => void;
  onEndCall: () => void;
}

export function ChatView({ 
  messages, 
  isListening, 
  personality,
  isMicMuted,
  onMicToggle,
  onEndCall
}: ChatViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <h1 className="text-lg font-medium text-white">{personality}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
          >
            <Info className="h-5 w-5 text-white" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="pt-16 pb-32 px-4">
        {isListening && (
          <div className="flex flex-col items-center justify-center space-y-6 pt-20">
            <div className="w-32 h-32 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
              <img 
                src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`} 
                alt="AI Assistant" 
                className="w-24 h-24 rounded-full"
              />
            </div>
            <p className="font-mono text-sm tracking-wider text-white/60">LISTENING...</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isUser={message.isUser || false}
              emotions={message.emotions}
              timestamp={message.timestamp}
              isInterruption={message.isInterruption}
            />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-24 left-0 right-0 px-4 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 px-6 py-3 text-white">
            Type a message...
          </div>
          <Button 
            size="icon" 
            className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Call Bar */}
      <CallBar
        activeCall={personality}
        isMicMuted={isMicMuted}
        onMicToggle={onMicToggle}
        onEndCall={onEndCall}
        callDuration={0}
        setCallDuration={() => {}}
      />
    </div>
  );
}