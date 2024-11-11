import { cn } from "@/lib/utils";

interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
  isInterruption?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isListening: boolean;
  personality: string;
}

export function ChatMessages({ messages, isListening, personality }: ChatMessagesProps) {
  return (
    <div className="flex-1 px-4 space-y-4 mb-24 overflow-y-auto">
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

      {messages.map((message, index) => (
        <div 
          key={index} 
          className={cn(
            "flex w-full",
            message.isUser ? "justify-end" : "justify-start"
          )}
        >
          {message.isInterruption ? (
            <div className="w-full flex justify-center">
              <div className="bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-sm font-mono text-gray-600">⏱ USER INTERRUPTION DETECTED</p>
              </div>
            </div>
          ) : (
            <div className={cn(
              "max-w-[85%] space-y-2",
              message.isUser ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-3xl px-4 py-3 shadow-sm",
                message.isUser 
                  ? "bg-white/90 backdrop-blur-sm ml-auto" 
                  : "bg-white/90 backdrop-blur-sm"
              )}>
                <p className="text-gray-800">{message.text}</p>
              </div>
              {message.emotions && (
                <div className="flex gap-2 px-1">
                  {message.emotions.map((emotion, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${emotion.color}`} />
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">
                        {emotion.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}