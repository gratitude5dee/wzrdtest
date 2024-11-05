import { ArrowLeft, Info, Mic, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  emotions?: string[];
  isUser?: boolean;
}

interface ChatProps {
  personality: string;
}

export function Chat({ personality }: ChatProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
      <header className="flex items-center justify-between p-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">{personality}</h1>
        <button className="p-2">
          <Info className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-1 p-4 space-y-4 mb-24">
        {isListening && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
              <img src="/quick-answers-avatar.png" alt="AI Assistant" className="w-24 h-24" />
            </div>
            <p className="font-mono text-sm">LISTENING...</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div className="bg-white rounded-2xl p-4 max-w-[80%] shadow-sm">
              <p>{message.text}</p>
              {message.emotions && (
                <div className="flex gap-2 mt-2">
                  {message.emotions.map((emotion, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {emotion}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <div className="flex justify-around items-center">
          <button className="p-4 rounded-full bg-gray-100">
            <Mic className="h-6 w-6" />
          </button>
          <button className="p-4 rounded-full bg-red-500 text-white">
            <MessageSquare className="h-6 w-6" />
          </button>
          <button className="p-4 rounded-full bg-gray-100">
            <MessageSquare className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}