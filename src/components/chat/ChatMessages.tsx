interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isListening: boolean;
  personality: string;
}

export function ChatMessages({ messages, isListening, personality }: ChatMessagesProps) {
  return (
    <div className="flex-1 px-6 space-y-6 mb-24 overflow-y-auto">
      {isListening && (
        <div className="flex flex-col items-center justify-center space-y-6 pt-20">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
            <img src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`} alt="AI Assistant" className="w-24 h-24" />
          </div>
          <p className="font-mono text-sm tracking-wider">LISTENING...</p>
        </div>
      )}

      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] space-y-2 ${message.isUser ? "items-end" : "items-start"}`}>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-gray-800">{message.text}</p>
            </div>
            {message.emotions && (
              <div className="flex gap-2 flex-wrap">
                {message.emotions.map((emotion, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${emotion.color}`} />
                    <span className="text-xs uppercase tracking-wider text-gray-600">
                      {emotion.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}