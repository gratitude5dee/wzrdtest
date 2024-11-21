import { ChatMessage } from "./ChatMessage";
import { CallBar } from "../CallBar";

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
    <div className="min-h-screen bg-gradient-to-br from-wzrd-blue via-wzrd-purple to-wzrd-pink">
      <div className="pt-16 pb-24 px-4">
        {isListening && (
          <div className="flex flex-col items-center justify-center space-y-6 pt-20">
            <div className="w-32 h-32 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
              <img 
                src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`} 
                alt="AI Assistant" 
                className="w-24 h-24 rounded-full"
              />
            </div>
            <p className="font-mono text-sm tracking-wider text-gray-600">LISTENING...</p>
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
      <CallBar
        isMicMuted={isMicMuted}
        onMicToggle={onMicToggle}
        onEndCall={onEndCall}
      />
    </div>
  );
}